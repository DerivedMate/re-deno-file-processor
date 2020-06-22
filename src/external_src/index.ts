type Package = [string, number];
type Maybe<T> = { ok: true; data: T } | { ok: false; data: null };

class maybe {
  static return<T>(a: T): Maybe<T> {
    return (a === null)
      ? {
        ok: false,
        data: null,
      }
      : {
        ok: true,
        data: a,
      };
  }

  static fmap<T, Q>(f: (a: T) => Q, a: Maybe<T>): Maybe<Q> {
    return !a.ok ? a : maybe.return(f(a.data));
  }
}

export async function* open_file(path: string): AsyncGenerator<string> {
  const f = await Deno.open(path, {
    read: true,
  });
  const decoder = new TextDecoder();

  let accumulator: string = "";

  for await (const chunk of Deno.iter(f, { bufSize: 1 })) {
    const [bit] = chunk;
    if (bit == 10) { // \n
      yield accumulator;
      accumulator = "";
    } else {
      accumulator += decoder.decode(chunk);
    }
  }
  if (accumulator) {
    yield accumulator;
  }
  f.close();
}

export async function* map<T, Q>(
  gen: AsyncGenerator<T>,
  f: (a: T) => Q,
): AsyncGenerator<Q> {
  for await (const a of gen) {
    yield f(a);
  }
}

export async function* filter<T>(
  gen: AsyncGenerator<T>,
  f: (a: T) => boolean,
): AsyncGenerator<T> {
  for await (const a of gen) {
    if (f(a)) {
      yield a;
    }
  }
}

export async function foldl<T, A>(
  gen: AsyncGenerator<T>,
  f: (acc: A, a: T) => A,
  a0: A,
): Promise<A> {
  let acc = a0;
  for await (const a of gen) {
    acc = f(acc, a);
  }

  return acc;
}

export async function consume<T, Q>(
  gen: AsyncGenerator<T>,
  f: (a: T) => Q,
) {
  for await (const a of gen) {
    f(a);
  }
}

export async function consumeI<T, Q>(
  gen: AsyncGenerator<T>,
  f: (a: T, i: number) => Q,
) {
  let i = 0;
  for await (const a of gen) {
    f(a, i);
    i++;
  }
}