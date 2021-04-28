@echo off
Rem I have to do this because someone at M$ thought that it was a good idea for Windows to open neofile.js in the default program (which isn't always node) when you type "neofile" into the console instead of using the neofile command that you installed with npm i -g
node neofile %*