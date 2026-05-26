#!/usr/bin/env node
'use strict'
const readline = require('readline')

const LANG = (process.env.LANG || process.env.LC_ALL || '').toLowerCase().includes('zh') ||
  (process.env.MENU_LANG || '').toLowerCase() === 'zh' ? 'zh' : 'en'

const ITEMS = {
  zh: [
    '下载直播回放（Step 1）',
    '音频分析 / 定位高光片段（Step 2）',
    '裁剪视频片段（Step 3）',
    '竖屏转换 9:16（Step 4）',
    '慢动作特效（Step 5）',
    '字幕烧录（Step 6）',
    'BGM 混音（Step 7）',
    '准备上传草稿（Step 8）',
    '完整流程从头开始',
    '其他（手动输入）',
  ],
  en: [
    'Download live replay (Step 1)',
    'Audio analysis / locate highlights (Step 2)',
    'Clip extraction (Step 3)',
    'Vertical conversion 9:16 (Step 4)',
    'Slow-motion effect (Step 5)',
    'Subtitle burn-in (Step 6)',
    'BGM mixing (Step 7)',
    'Prepare upload draft (Step 8)',
    'Full workflow from scratch',
    'Other (type manually)',
  ],
}

const PROMPT = { zh: '你要做哪一步？', en: 'What do you want to do?' }
const OTHER_PROMPT = { zh: '请输入你想做的事：', en: 'Describe what you want to do: ' }
const HINT = { zh: '（↑↓ 移动，Enter 确认，Ctrl+C 退出）', en: '(↑↓ to move, Enter to confirm, Ctrl+C to exit)' }

const items = ITEMS[LANG]
let selected = 0

function render() {
  process.stdout.write('\x1B[2J\x1B[0f')
  console.log(`${PROMPT[LANG]}\n${HINT[LANG]}\n`)
  items.forEach((s, i) => {
    process.stdout.write(i === selected ? `\x1B[36m❯ ${s}\x1B[0m\n` : `  ${s}\n`)
  })
}

function promptOther() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  if (process.stdin.isTTY) process.stdin.setRawMode(false)
  rl.question(`\n${OTHER_PROMPT[LANG]}`, answer => {
    rl.close()
    process.stdout.write(`\n${answer}\n`)
    process.exit(0)
  })
}

if (!process.stdin.isTTY) {
  // non-interactive: print menu as text and exit
  console.log(`${PROMPT[LANG]}\n`)
  items.forEach((s, i) => console.log(`${i + 1}. ${s}`))
  process.exit(0)
}

render()
readline.emitKeypressEvents(process.stdin)
process.stdin.setRawMode(true)

process.stdin.on('keypress', (_, key) => {
  if (!key) return
  if (key.name === 'up') { selected = (selected - 1 + items.length) % items.length; render() }
  else if (key.name === 'down') { selected = (selected + 1) % items.length; render() }
  else if (key.name === 'return') {
    if (selected === items.length - 1) { promptOther() }
    else { process.stdout.write(`\n${items[selected]}\n`); process.exit(0) }
  }
  else if (key.ctrl && key.name === 'c') process.exit(1)
})
