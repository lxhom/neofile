// noinspection JSUnresolvedFunction,JSUnresolvedVariable

let main = () => {
  // module/CLI test
  if (module.parent === null) {
    // CLI mode
    // commander initialisation
    const {Command} = require('commander');
    const fs = require("fs");

    // init new command
    const program = new Command();

    program
        // set version
        .version('0.0.0')

        // set options
        .option("-i, --interactive", "run neofile in the interactive mode (default)")
        .option("-l, --load <file>", "load configuration from file")

        .parse(process.argv);

    const opts = program.opts();

    if (opts.interactive || opts.load === undefined) {
      // interactive mode
      // init enq
      const enq = require('enquirer');

      // main menu
      let main = async () => {
        let choice = await (new enq.Select({
          message: "Main menu. What do you want to do?",
          choices: ["Make a new neofile configuration", "Edit an existing neofile configuration", "Render an" +
          " existing neofile configuration", "Exit"]
        })).run();
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
        await main();
      };

      let newConfig = async () => {
        let filename = await (new enq.Input({
          message: "Enter a name for your config",
          initial: "myNeofileConfig"
        })).run();
        filename += ".nf.json"
        if (fs.existsSync(filename)) {
          console.log(filename, "already exists! Please choose another name.")
          await newConfig();
        } else {
          fs.writeFileSync(filename, "{}");
          await configEditor(filename);
        }
      }

      let loadConfig = async () => {
        let filename = await (new enq.Input({
          message: "Type the name of the neofile config file",
          initial: "myNeofileConfig.nf.json"
        })).run();
        if (!filename.endsWith(".nf.json") && fs.existsSync(filename + ".nf.json")) filename += ".nf.json"
        if (fs.existsSync(filename)) {
          await configEditor(filename, JSON.parse(fs.readFileSync(filename).toString()))
        } else {
          console.log("The file", filename, "doesn't exist! Please choose another file.")
          await loadConfig();
        }
      }

      let configEditor = async (filename, config = {}) => {
        console.log(config)
        if (config.ascii === undefined) {
          config.ascii = await selectAsciiArt()
        }

      };

      let selectAsciiArt = async () => {
        let choice = await (new enq.Select({
          message: "Which ASCII Art do you want to use?",
          choices: ["GitHub Logo", "Other..."]
        })).run();
        let asciiArt;
        switch (choice) {
        case "GitHub Logo":
          asciiArt = require("./github.asciiart.js");
          break;
        case "Other...":
          let filename = await (new enq.Input({
            message: "Enter the name of the file with the ASCII art (type 'back' to get back)",
            initial: "asciiArt.txt"
          })).run();
          if (filename === "back") return await selectAsciiArt();
          try {
            asciiArt = fs.readFileSync(filename).toString();
          } catch (e) {
            console.log("Couldn't read that file. Error:", e.toString())
            asciiArt = await selectAsciiArt()
          }
        }
        console.log("Loaded this ASCII art:\n" + asciiArt)
      }

      main().then(() => console.log("Something went wrong."));
    } else {
      // load mode
    }

  } else {
    // module mode
    module.exports = generator;
  }
};

let generator = settings => {

};

main();