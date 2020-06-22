type t('a);

[@bs.module "./external/index.js"]
external open_file: string => t('a) = "open_file";

[@bs.module "./external/index.js"] [@bs.val]
external map: (t('a), 'a => 'b) => t('b) = "map";

[@bs.module "./external/index.js"] [@bs.val]
external filter: (t('a), 'a => bool) => t('a) = "filter";

[@bs.module "./external/index.js"] [@bs.val]
external foldl: (t('a), ('b, 'a) => 'b, 'b) => t('b) = "foldl";

[@bs.module "./external/index.js"] [@bs.val]
external consume: (t('a), 'a => 'b) => unit = "consume";

let (<$>) = (f, x) => map(x, f);
let (>>=) = map;
let (>>-) = filter;
let ($>>) = foldl;
let (>>) = consume;