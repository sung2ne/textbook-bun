// src/cli/process-monitor.ts
interface ProcessInfo {
  pid: number;
  name: string;
  cpu: string;
  memory: string;
}

export async function listNodeProcesses(): Promise<ProcessInfo[]> {
  const proc = Bun.spawn(["ps", "aux"], {
    stdout: "pipe"
  });

  const output = await new Response(proc.stdout).text();
  await proc.exited;

  const lines = output.trim().split("\n");
  const processes: ProcessInfo[] = [];

  for (const line of lines.slice(1)) { // 헤더 건너뛰기
    if (line.includes("node") || line.includes("bun")) {
      const parts = line.split(/\s+/);
      processes.push({
        pid: parseInt(parts[1]),
        name: parts[10] || "unknown",
        cpu: parts[2] + "%",
        memory: parts[3] + "%"
      });
    }
  }

  return processes;
}

export async function watchProcess(pid: number, interval = 1000) {
  console.log(`프로세스 ${pid} 모니터링 시작...`);
  console.log("Ctrl+C로 종료\n");

  const checkProcess = async () => {
    const proc = Bun.spawn(["ps", "-p", pid.toString(), "-o", "pid,pcpu,pmem,comm"], {
      stdout: "pipe",
      stderr: "pipe"
    });

    const output = await new Response(proc.stdout).text();
    await proc.exited;

    if (proc.exitCode !== 0) {
      console.log(`프로세스 ${pid}가 종료되었습니다.`);
      return false;
    }

    const lines = output.trim().split("\n");
    if (lines.length > 1) {
      const [, pid, cpu, mem, cmd] = lines[1].split(/\s+/);
      console.log(`PID: ${pid} | CPU: ${cpu}% | MEM: ${mem}% | ${cmd}`);
    }
    return true;
  };

  while (await checkProcess()) {
    await Bun.sleep(interval);
  }
}
