import fs from 'node:fs'
import path from 'node:path'

// 互动数据落盘目录：默认项目根下 data/，可用 XH_DATA_DIR 覆盖（测试用临时目录）
export function dataDir(): string {
  return process.env.XH_DATA_DIR || path.join(process.cwd(), 'data')
}

function filePath(name: string): string {
  return path.join(dataDir(), `${name}.json`)
}

export function readJson<T>(name: string, fallback: T): T {
  const file = filePath(name)
  if (!fs.existsSync(file)) return fallback
  const raw = fs.readFileSync(file, 'utf8')
  return JSON.parse(raw) as T
}

export function writeJson(name: string, data: unknown): void {
  const dir = dataDir()
  fs.mkdirSync(dir, { recursive: true })
  const file = filePath(name)
  const tmp = `${file}.tmp`
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8')
  fs.renameSync(tmp, file)
}
