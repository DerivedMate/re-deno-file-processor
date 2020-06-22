open Lib;
let f: Lib.t(string) = Lib.open_file("data/input.txt");
f >>= Js.String2.toUpperCase >> Js.Console.log;