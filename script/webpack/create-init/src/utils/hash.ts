/**
 * get file hash if exists
 */

import * as fs from 'fs'
import * as crypto from 'crypto'


export function getFileHash(filepath: string,
                            algorithm?: string,
                            encoding?: crypto.HexBase64Latin1Encoding): string | null {
  if(!filepath) return null
  if(!fs.existsSync(filepath)) return null
  const stat: fs.Stats = fs.statSync(filepath)
  if(!stat.isFile) return null
  const content: Buffer = fs.readFileSync(filepath)
  return getContentHash(content, algorithm, encoding)
}

export function getContentHash(content: string | Buffer,
                               algorithm: string = 'md5',
                               encoding: crypto.HexBase64Latin1Encoding = 'hex'): string {
  return crypto
    .createHash(algorithm)
    .update(content)
    .digest(encoding)
}
