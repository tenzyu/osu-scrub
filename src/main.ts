#!/usr/bin/env zx

import { $, question } from 'zx'

const meansYes = ['y', 'Y', 'yes', 'Yes', 'YES']
const yesOrNo = async (query: string) =>
  meansYes.includes((await question(`${query} (Y/n) `)) || 'y')

const SEFILES_REGEX = '.*('.concat(
  [
    'applause',
    'combobreak',
    'failsound',
    'pause-loop',
    `wafer\ pitched`,
    'section(fail|pass)',
    'spinner(bonus|spin)',
    '(drum|normal|soft)-(hitclap|hitfinish|hitnormal|(hit|slider)whistle|sliderslide|slidertick)[0-9]+?',
  ]
    .join('|')
    .concat(').(wav|ogg)')
)

// これは osu! の Songs フォルダの中にある Skins や StoryBoard, Video などを削除する Osu! の軽量化スクリプトになります。
;(async () => {
  const osuDir = process.argv[2]

  if (!osuDir) {
    console.log('Please specify the path to the osu! folder.')
    return
  }

  const isDelSE = await yesOrNo(
    'Do you want to delete the SoundEffects in the Songs folder?'
  )
  const isDelSkin = await yesOrNo(
    'Do you want to delete the Map-Skins in the Songs folder?'
  )
  const isDelVideo = await yesOrNo(
    'Do you want to delete the Videos in the Songs folder?'
  )
  const isDelSB = await yesOrNo(
    '[BETA] Do you want to delete the StoryBoards in the Songs folder?'
  )

  const builder = []
  isDelSE && builder.push('SoundEffects')
  isDelSkin && builder.push('Map-Skins')
  isDelVideo && builder.push('Videos')
  isDelSB && builder.push('StoryBoards')
  const items = builder.join(', ')

  const isSure = await yesOrNo(
    `Are you sure you want to delete the ${items} in the Songs folder?`
  )

  if (!isSure) {
    console.log('Canceled.')
    return
  }

  // FIXME: osu! とか、find には osu\! で渡す必要があるが osu\! は osu! に、osu\\! は osu\\\\! に変換されて動かない
  if (isDelSE) {
    await $`find "~/.local/share/osu-wine/osu!/Songs" -type f -regextype posix-egrep -regex \"${SEFILES_REGEX}\"`
  }
})()
