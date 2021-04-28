#!/usr/bin/env node
// noinspection JSUnresolvedFunction

let main = () => {
  // module/CLI test
  if (require.main === module) {
    // CLI mode
    // commander initialisation
    const { Command } = require('commander');
    const fs = require("fs");

    // init new command
    const program = new Command();

    program
        // set version
        .version('0.0.0')

        // set options
        .option("-i, --interactive", "run neofile in the interactive mode (default)")
        .option("-l, --load <file>", "load configuration from file")

        // parse arguments
        .parse(process.argv);

    // store opts in the opts object
    const opts = program.opts();

    // check if interactive mode is on
    if (opts.interactive || opts.load === undefined) {
      // interactive mode
      // init enq
      const enq = require('enquirer');

      const defaultConfig = {
        "ascii": "",
        "title": {
          "activated": false,
          "name": "",
          "location": "",
          "separator": false
        },
        "data": [
          {
            "type": "Value",
            "scripted": false,
            "keyContent": "Key",
            "valueContent": "Value"
          }
        ]
      };

      // collapse every function here for better readability and open the ones that you need

      // main menu
      let main = async () => {
        // main menu choice
        let choice = await (new enq.Select({
          message: "Main menu. What do you want to do?",
          choices: ["Make a new neofile configuration", "Edit an existing neofile configuration", "Render an" +
          " existing neofile configuration", "Exit"]
        })).run();

        // see case strings
        switch (choice) {
          case "Make a new neofile configuration":
            await newConfig();
            break;
          case "Edit an existing neofile configuration":
            await loadConfig();
            break;
          case "Render an existing neofile configuration":
            console.log("Not yet implemented");
            break;
          case "Exit":
            console.log("Goodbye!");
            process.exit(0);
            break;
        }

        // loop around
        await main();
      };

      // new configuration prompt
      let newConfig = async () => {

        // name prompt
        let filename = await (new enq.Input({
          message: "Enter a name for your config",
          initial: "myNeofileConfig"
        })).run();

        // add extension
        filename += ".nf.json";

        // check if the file already exists
        if (fs.existsSync(filename)) {

          // loop around and ask again if it already exists
          console.log(filename, "already exists! Please choose another name.");
          await newConfig();
        } else {

          // or write an empty JSON into the filename
          // TODO: write default NF.JSON into the new file
          fs.writeFileSync(filename, JSON.stringify(defaultConfig));

          // and start the config editor
          await configEditor(filename);
        }
      };

      // config load prompt
      let loadConfig = async () => {

        // filename prompt
        let filename = await (new enq.Input({
          message: "Type the name of the neofile config file",
          initial: "myNeofileConfig.nf.json"
        })).run();

        // add file extension if its detected as missing
        if (!filename.endsWith(".nf.json") && fs.existsSync(filename + ".nf.json")) {
          filename += ".nf.json";
        }

        // check if file exists
        if (fs.existsSync(filename)) {

          // start the config editor if it already exists
          await configEditor(filename);
        } else {

          // or display an error and start the chooser again
          console.log("The file", filename, "doesn't exist! Please choose another file.");
          await loadConfig();
        }
      };

      // configuration editor
      let configEditor = async filename => {

        // load config
        let config = JSON.parse(fs.readFileSync(filename).toString())

        // TODO: WIP: implement full editor

        // editor menu
        let choice = await (new enq.Select({
          message: "What do you want to do?",
          choices: [
            "Edit ASCII Art",
            "Edit Title",
            "Edit Data",
            "Exit"
          ]
        })).run();

        switch (choice) {
          case "Edit ASCII Art":
            console.log("Current ascii art:\n" + config.ascii)
            config.ascii = await asciiArtEditor(config.ascii)
            console.log("Loaded this ASCII art:\n" + config.ascii);
            break;
          case "Edit Title":
            let currentTitleRenderer = titleObj => {
              let out;
              if (titleObj.activated) {
                out = titleObj.name + "@" + titleObj.location + ", Separator: " + (titleObj.separator ? "Enabled" : "Disabled")
              } else {
                out = "Deactivated"
              }
              return out;
            }

            console.log("Current title: " + currentTitleRenderer(config.title));
            config.title = titleEditor(config.title);
            console.log("Updated title: " + currentTitleRenderer(config.title));
            break;
          case "Edit Data":

            break;
          case "Exit":
            return;
        }
        fs.writeFileSync(filename, JSON.stringify(config));
        console.log("Wrote the configuration to", filename)
        await configEditor(filename);
      };

      // ascii art editor
      let asciiArtEditor = async asciiArt => {

        // ascii art prompt
        let choice = await (new enq.Select({
          message: "Which ASCII Art do you want to use?",
          choices: ["GitHub Logo", "Other...", "Go back"]
        })).run();

        switch (choice) {
          case "GitHub Logo":
            // TODO: make this modular
            asciiArt = require("./github.asciiart.js");
            break;
          case "Other...":
            let filename = await (new enq.Input({
              message: "Enter the name of the file with the ASCII art (type 'back' to get back)",
              initial: "asciiArt.txt"
            })).run();
            if (filename === "back") {
              return await asciiArtEditor(asciiArt);
            }
            try {
              asciiArt = fs.readFileSync(filename).toString();
            } catch (e) {
              console.log("Couldn't read that file. Error:", e.toString());
              asciiArt = await asciiArtEditor(asciiArt);
            }
          break;
        }
        return asciiArt;
      };

      // title editor
      let titleEditor = async title => {
        console.log("Not yet implemented");
        return title;
      }

      main().then(() => console.log("Something went wrong."));
    } else {

      // load mode
      console.log("not yet implemented");
    }

  } else {

    // module mode
    module.exports = generator;
  }
};

let generator = settings => {
  return JSON.stringify(settings);
};

main();