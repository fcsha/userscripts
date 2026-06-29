import { readFileSync, readdirSync, statSync, writeFileSync } from 'fs'
import { resolve, relative, join } from 'path'

/* ---------- 常量 ---------- */

const ROOT = import.meta.dirname
const SRC = resolve(ROOT, 'src')
const DIST = resolve(ROOT, 'dist')

/* ---------- 工具函数 ---------- */

function walk(dir) {
  const results = []
  for (const name of readdirSync(dir)) {
    if (name.startsWith('_') || name.startsWith('.')) continue
    const full = join(dir, name)
    if (statSync(full).isDirectory()) {
      results.push(...walk(full))
    } else if (name.endsWith('.js')) {
      results.push(full)
    }
  }
  return results
}

function extractMeta(filePath) {
  const src = readFileSync(filePath, 'utf8')
  const match = src.match(/\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/)
  return match ? match[0] : ''
}

/* ---------- 入口发现 ---------- */

function findEntries() {
  const entries = {}
  for (const file of walk(SRC)) {
    if (!extractMeta(file)) continue
    const rel = relative(SRC, file).replace(/\\/g, '/').replace(/\.js$/, '')
    entries[rel] = file
  }
  return entries
}

/* ---------- 插件：UserScript 元数据 ---------- */

function userscriptMetaPlugin() {
  return {
    name: 'userscript-meta',
    renderChunk(code, chunk) {
      const meta = extractMeta(chunk.facadeModuleId)
      return meta ? meta + '\n\n' + code : null
    },
    writeBundle() {
      for (const f of walk(DIST)) {
        if (!f.endsWith('.user.js')) continue
        let content = readFileSync(f, 'utf8')
        content = content.replace(/(\/\/ ==\/UserScript==)\n(?!\n)/, '$1\n\n')
        writeFileSync(f, content)
      }
    },
  }
}

/* ---------- 导出配置 ---------- */

export default {
  input: findEntries(),
  resolve: {
    alias: { '@shared': resolve(SRC, 'shared') },
  },
  output: {
    dir: 'dist',
    format: 'iife',
    entryFileNames: '[name].user.js',
  },
  plugins: [userscriptMetaPlugin()],
}
