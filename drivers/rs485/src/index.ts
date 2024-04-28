import { createAsyncLock, type DriverFactory } from "@dmxjs/shared";
import { setTimeout as sleep } from "node:timers/promises";
import { SerialPort } from "serialport";
import { promisify } from "util";

export interface RS485Options {
  path?: string;
  interval?: number;
}

export function rs485({
  path,
  interval = 30,
}: RS485Options = {}): DriverFactory {
  if (!path) {
    throw new Error("Path autodetection in RS485 is not implemented yet");
  }

  return (universe) => {
    const lock = createAsyncLock();

    const port = new SerialPort({
      path,
      baudRate: 250000,
      dataBits: 8,
      stopBits: 2,
      parity: "none",
      autoOpen: true,
    });

    const set = promisify(port.set);

    const write = (buf: Buffer) => {
      return new Promise<void>((resolve, reject) => {
        port.write(buf, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    };

    const commit = async () => {
      await lock.run(async () => {
        await set({ brk: true, rts: true });
        await sleep(1); // MAB Duration
        await set({ brk: false, rts: true });

        await write(universe);

        return new Promise<void>((resolve) => {
          port.drain(() => resolve());
        });
      });
    };

    const timer = setInterval(commit, interval);

    return () => {
      clearTimeout(timer);
    };
  };
}
