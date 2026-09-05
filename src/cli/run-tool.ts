/** Run a build tool to completion; a non-zero exit throws with its stderr. */
export const runTool = async (
  label: string,
  argv: readonly string[],
  opts: { readonly cwd?: string } = {},
): Promise<void> => {
  const proc = Bun.spawn([...argv], {
    ...(opts.cwd !== undefined ? { cwd: opts.cwd } : {}),
    stdout: 'pipe',
    stderr: 'pipe',
  });
  const exitCode = await proc.exited;
  if (exitCode !== 0) {
    const stderr = await new Response(proc.stderr).text();
    throw new Error(`${label} failed (exit ${exitCode}):\n${stderr}`);
  }
};
