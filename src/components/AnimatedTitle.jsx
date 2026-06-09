import { useEffect, useMemo, useRef, useState } from 'react'
import titleFontUrl from '../assets/fonts/Unbounded-Black.ttf'

const TITLE_TEXT = 'UNKIND'
const TITLE_FONT_FAMILY = 'UnkindTitle'
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&?'
const SIGNAL_FRAMES = ['PROJEK', 'TLYOON', 'NIKHILN', 'PRIYAN', 'KAPRIY']

const SCRAMBLE_TICK_MS = 40
const SHAPE_SETTLE_TICK = 25
const SHAPE_HOLD_TICKS = 25
const FINAL_LOCK_START_TICK = SHAPE_SETTLE_TICK + SHAPE_HOLD_TICKS
const SCRAMBLE_LOCK_TICKS = 2
const SIGNAL_WORD_HOLD_TICKS = 1
const SIGNAL_WORD_START_TICK = 6
const SIGNAL_WORD_GAP_TICKS = 3
const DEBUG_HOLD_SHAPES = false
const SHAPE_ROW_OFFSET_DOT_PITCHES = 0.4
const SIDE_EMPTY_DOT_COLUMNS = 4
const CURRENT_VISIBLE_SIDE_DOT_COLUMNS = 1
const VERTICAL_PADDING_RATIO = 0.24

const ACTIVE_DOT_COLOR = [232, 198, 126]
const INACTIVE_DOT_COLOR = [232, 198, 126]
const INACTIVE_DOT_OPACITY = 0.13

const MOON_PATH_DATA = 'M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z'
const PLANET_PATH_DATA = 'M23.96 10.92c-0.56-1.28-2.64-1.52-6.2-0.72-1.48-1.44-3.48-2.32-5.72-2.32-4.48-0.040-8.12 3.64-8.12 8.12 0 0.040 0 0.080 0 0.12-3.040 2-4.32 3.68-3.76 4.96 0.36 0.84 1.4 1.2 2.76 1.2 1 0 2.2-0.2 3.44-0.48 1.48 1.44 3.48 2.36 5.72 2.36 4.48 0 8.16-3.64 8.16-8.16 0-0.040 0-0.080 0-0.12 2.48-1.68 4.36-3.52 3.72-4.96zM12.080 9.52c3.24 0 5.92 2.4 6.4 5.48-1.48 0.92-3.32 1.88-5.6 2.84-2.24 0.96-4.24 1.64-5.92 2.080-0.84-1.080-1.36-2.44-1.36-3.92-0.040-3.56 2.88-6.48 6.48-6.48zM1.72 20.44c0.040-0.28 0.56-1.12 2.44-2.44 0.2 0.84 0.56 1.64 1 2.36-1.88 0.36-3.12 0.32-3.44 0.080zM12.080 22.48c-1.4 0-2.68-0.44-3.72-1.2 1.84-0.56 3.72-1.24 5.2-1.88s3.24-1.48 4.92-2.44c-0.48 3.12-3.16 5.52-6.4 5.52zM19.96 14c-0.2-0.84-0.56-1.64-1-2.36 2.28-0.44 3.24-0.24 3.44-0.080-0.040 0.44-0.88 1.32-2.44 2.44z'
const CROWN_PATH_DATA = [
  'M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z',
  'M5 21h14',
]
const MINE_PATH_DATA = [
  'M 11 12 a 1 1 0 1 0 2 0 a 1 1 0 1 0 -2 0',
  'M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z',
  'M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z',
]
const SAFE_PATH_DATA = [
  'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z',
  'M9 12h6',
  'M12 9v6',
]
const STAR_PATH_DATA = [
  'm12 3 1.43 5.31c.17.65.26.97.43 1.24a2 2 0 0 0 .6.59c.26.17.58.26 1.23.43L21 12l-5.31 1.43c-.65.17-.97.26-1.24.43a2 2 0 0 0-.59.6c-.17.26-.26.58-.43 1.23L12 21l-1.43-5.31a4 4 0 0 0-.43-1.24 2 2 0 0 0-.6-.59 4 4 0 0 0-1.23-.43L3 12l5.31-1.43c.65-.17.97-.26 1.24-.43a2 2 0 0 0 .59-.6c.17-.26.26-.58.43-1.23z',
]

const getRandomTitleCharacter = () => SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]

const createScrambledTitle = (lockedLetters = 0) => TITLE_TEXT
  .split('')
  .map((letter, index) => (index < lockedLetters ? letter : getRandomTitleCharacter()))
  .join('')

const getSignalWord = (tick) => SIGNAL_FRAMES.find((_, index) => {
  const startTick = SIGNAL_WORD_START_TICK + index * SIGNAL_WORD_GAP_TICKS
  return tick >= startTick && tick < startTick + SIGNAL_WORD_HOLD_TICKS
})

const shaderRandom = (x) => {
  const value = Math.sin(x) * 43758.5453
  return value - Math.floor(value)
}

const rgba = ([red, green, blue], opacity) => `rgba(${red}, ${green}, ${blue}, ${opacity})`

const createPathList = (paths) => paths.map((path) => new Path2D(path))

function drawDotGrid(ctx, metrics, { active, elapsed, flickerStartX, flickerEndX }) {
  const {
    canvasWidth,
    canvasHeight,
    textX,
    dotPitch,
    activeRadius,
    inactiveRadius,
  } = metrics

  const radius = active ? activeRadius : inactiveRadius
  const flickerTick = Math.floor(elapsed * 20)
  const isFlickeringNow = shaderRandom(flickerTick) < 0.12
  const dotColumns = []

  for (let x = textX; x >= 0; x -= dotPitch) {
    dotColumns.push(x)
  }

  for (let x = textX + dotPitch; x <= canvasWidth; x += dotPitch) {
    dotColumns.push(x)
  }

  dotColumns.forEach((x) => {
    for (let y = 0; y <= canvasHeight; y += dotPitch) {
      const opacity = active && x >= flickerStartX && x <= flickerEndX && isFlickeringNow
        ? 0.13
        : active ? 1 : INACTIVE_DOT_OPACITY

      ctx.beginPath()
      ctx.fillStyle = active ? rgba(ACTIVE_DOT_COLOR, opacity) : rgba(INACTIVE_DOT_COLOR, opacity)
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }
  })
}

function drawShapeMask(ctx, metrics, shapeGlyphs) {
  const { shapeSlots, verticalPadding, textHeight } = metrics

  shapeGlyphs.forEach((glyph, index) => {
    const slot = shapeSlots[index]
    const targetSize = textHeight * glyph.sizeRatio
    const scale = targetSize / glyph.maxExtent
    const centerX = slot.x + slot.width / 2
    const centerY = verticalPadding + textHeight / 2

    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.scale(scale, scale)
    ctx.translate(-glyph.centerX, -glyph.centerY)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    if (glyph.style === 'stroke') {
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = glyph.strokeWidth
      glyph.paths.forEach((path) => ctx.stroke(path))
    } else {
      ctx.fillStyle = '#ffffff'
      glyph.paths.forEach((path) => ctx.fill(path))
    }

    ctx.restore()
  })
}

function drawTextMask(ctx, metrics, displayText) {
  const { fontSize, letterPositions, textX, textY } = metrics

  ctx.fillStyle = '#ffffff'
  ctx.font = `900 ${fontSize}px ${TITLE_FONT_FAMILY}`
  ctx.textBaseline = 'alphabetic'

  if (displayText === TITLE_TEXT) {
    ctx.fillText(TITLE_TEXT, textX, textY)
    return
  }

  displayText.split('').forEach((letter, index) => {
    ctx.fillText(letter, letterPositions[index] ?? textX, textY)
  })
}

export default function AnimatedTitle({
  maxWidth = 380,
  onRevealComplete,
  onResolveComplete,
  className = '',
  shouldResolveToTitle = false,
  shouldPlayIntro = true,
}) {
  const canvasRef = useRef(null)
  const onRevealCompleteRef = useRef(onRevealComplete)
  const onResolveCompleteRef = useRef(onResolveComplete)
  const [fontLoaded, setFontLoaded] = useState(false)
  const [aspectRatio, setAspectRatio] = useState('380 / 104')

  const shapeGlyphs = useMemo(() => [
    { paths: createPathList(CROWN_PATH_DATA), centerX: 12, centerY: 12, maxExtent: 24, sizeRatio: 0.92, style: 'stroke', strokeWidth: 2 },
    { paths: createPathList([MOON_PATH_DATA]), centerX: 12, centerY: 12, maxExtent: 20, sizeRatio: 0.66, style: 'fill' },
    { paths: createPathList(SAFE_PATH_DATA), centerX: 12, centerY: 12, maxExtent: 24, sizeRatio: 0.86, style: 'stroke', strokeWidth: 2 },
    { paths: createPathList([PLANET_PATH_DATA]), centerX: 12, centerY: 15, maxExtent: 24, sizeRatio: 0.79, style: 'fill' },
    { paths: createPathList(MINE_PATH_DATA), centerX: 12, centerY: 12, maxExtent: 24, sizeRatio: 0.82, style: 'stroke', strokeWidth: 2 },
    { paths: createPathList(STAR_PATH_DATA), centerX: 12, centerY: 12, maxExtent: 24, sizeRatio: 0.89, style: 'stroke', strokeWidth: 2 },
  ], [])

  useEffect(() => {
    onRevealCompleteRef.current = onRevealComplete
  }, [onRevealComplete])

  useEffect(() => {
    onResolveCompleteRef.current = onResolveComplete
  }, [onResolveComplete])

  useEffect(() => {
    let cancelled = false

    const loadFont = async () => {
      if (!('fonts' in document)) {
        setFontLoaded(true)
        return
      }

      const existingFonts = Array.from(document.fonts).filter((fontFace) => fontFace.family === TITLE_FONT_FAMILY)
      if (existingFonts.length === 0) {
        const titleFont = new FontFace(TITLE_FONT_FAMILY, `url(${titleFontUrl})`, {
          weight: '900',
          style: 'normal',
          display: 'block',
        })
        document.fonts.add(titleFont)
        await titleFont.load()
      }

      await document.fonts.load(`900 82px ${TITLE_FONT_FAMILY}`, TITLE_TEXT)
      await document.fonts.ready

      if (!cancelled) {
        setFontLoaded(true)
      }
    }

    loadFont().catch(() => {
      if (!cancelled) {
        setFontLoaded(true)
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!fontLoaded) return undefined

    const canvas = canvasRef.current
    if (!canvas) return undefined

    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    const resolvedMaxWidth = Math.max(260, maxWidth)
    const fontSize = Math.round(Math.max(56, Math.min((resolvedMaxWidth - 52) / 4.0, 116)))

    ctx.font = `900 ${fontSize}px ${TITLE_FONT_FAMILY}`
    const bounds = ctx.measureText(TITLE_TEXT)
    const verticalPadding = Math.round(fontSize * VERTICAL_PADDING_RATIO)
    const dotPitch = Math.max(5.2, fontSize * 0.086)
    const horizontalPadding = Math.round(
      fontSize * 0.38 + dotPitch * (SIDE_EMPTY_DOT_COLUMNS - CURRENT_VISIBLE_SIDE_DOT_COLUMNS),
    )
    const textWidth = Math.ceil(bounds.width)
    const textHeight = Math.ceil(
      Math.abs(bounds.actualBoundingBoxAscent || fontSize * 0.78)
      + (bounds.actualBoundingBoxDescent || fontSize * 0.22),
    )
    const canvasWidth = textWidth + horizontalPadding * 2
    const canvasHeight = textHeight + verticalPadding * 2
    const textX = horizontalPadding
    const textY = verticalPadding + Math.abs(bounds.actualBoundingBoxAscent || fontSize * 0.78)
    const activeRadius = dotPitch * 0.42
    const inactiveRadius = dotPitch * 0.30
    const dpr = window.devicePixelRatio || 1
    const slotWidth = textWidth / TITLE_TEXT.length
    const rowOffset = dotPitch * SHAPE_ROW_OFFSET_DOT_PITCHES
    const letterPositions = TITLE_TEXT
      .split('')
      .map((_, index) => textX + ctx.measureText(TITLE_TEXT.slice(0, index)).width)
    const shapeSlots = TITLE_TEXT
      .split('')
      .map((_, index) => ({
        x: textX + rowOffset + slotWidth * index,
        width: slotWidth,
      }))

    const boundsStart = ctx.measureText('UNK')
    const boundsEnd = ctx.measureText('UNKI')
    const flickerStartX = textX + boundsStart.width - dotPitch
    const flickerEndX = textX + boundsEnd.width + dotPitch

    const metrics = {
      canvasWidth,
      canvasHeight,
      fontSize,
      verticalPadding,
      textHeight,
      textX,
      textY,
      dotPitch,
      activeRadius,
      inactiveRadius,
      letterPositions,
      shapeSlots,
    }

    setAspectRatio(`${canvasWidth} / ${canvasHeight}`)

    canvas.width = Math.ceil(canvasWidth * dpr)
    canvas.height = Math.ceil(canvasHeight * dpr)
    canvas.style.width = '100%'
    canvas.style.height = 'auto'
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const maskCanvas = document.createElement('canvas')
    maskCanvas.width = canvasWidth
    maskCanvas.height = canvasHeight
    const maskCtx = maskCanvas.getContext('2d')

    const activeCanvas = document.createElement('canvas')
    activeCanvas.width = canvasWidth
    activeCanvas.height = canvasHeight
    const activeCtx = activeCanvas.getContext('2d')

    if (!maskCtx || !activeCtx) return undefined

    let animationFrameId
    let startTime = null
    let displayState = shouldPlayIntro
      ? { kind: 'letters', text: createScrambledTitle() }
      : { kind: 'letters', text: TITLE_TEXT }
    let lastStateTick = -1
    let finalLockTick = 0
    let hasNotifiedReveal = false
    let hasNotifiedResolve = false
    let revealFrameId
    let revealPaintFrameId
    let resolveFrameId
    let resolvePaintFrameId

    const updateDisplayState = (currentTick) => {
      if (!shouldPlayIntro || currentTick === lastStateTick) return

      lastStateTick = currentTick

      if (currentTick >= SHAPE_SETTLE_TICK && currentTick < FINAL_LOCK_START_TICK) {
        displayState = { kind: 'shapes' }
        return
      }

      if (currentTick >= FINAL_LOCK_START_TICK && !shouldResolveToTitle) {
        displayState = { kind: 'shapes' }
        return
      }

      if (DEBUG_HOLD_SHAPES && currentTick >= FINAL_LOCK_START_TICK) {
        displayState = { kind: 'shapes' }
        return
      }

      const signalWord = currentTick < SHAPE_SETTLE_TICK ? getSignalWord(currentTick) : undefined

      if (signalWord) {
        displayState = { kind: 'letters', text: signalWord }
        return
      }

      if (currentTick >= FINAL_LOCK_START_TICK) {
        finalLockTick += 1
      }

      const lockedLetters = Math.max(0, Math.floor(finalLockTick / SCRAMBLE_LOCK_TICKS))
      displayState = lockedLetters >= TITLE_TEXT.length
        ? { kind: 'letters', text: TITLE_TEXT }
        : { kind: 'letters', text: createScrambledTitle(lockedLetters) }
    }

    const drawFrame = (timestamp) => {
      if (startTime === null) startTime = timestamp

      const elapsed = (timestamp - startTime) / 1000
      const currentTick = Math.floor(elapsed / (SCRAMBLE_TICK_MS / 1000))
      updateDisplayState(currentTick)

      ctx.clearRect(0, 0, canvasWidth, canvasHeight)
      drawDotGrid(ctx, metrics, {
        active: false,
        elapsed,
        flickerStartX,
        flickerEndX,
      })

      maskCtx.clearRect(0, 0, canvasWidth, canvasHeight)
      if (displayState.kind === 'shapes') {
        drawShapeMask(maskCtx, metrics, shapeGlyphs)
      } else {
        drawTextMask(maskCtx, metrics, displayState.text)
      }

      activeCtx.clearRect(0, 0, canvasWidth, canvasHeight)
      activeCtx.globalCompositeOperation = 'source-over'
      drawDotGrid(activeCtx, metrics, {
        active: true,
        elapsed,
        flickerStartX,
        flickerEndX,
      })
      activeCtx.globalCompositeOperation = 'destination-in'
      activeCtx.drawImage(maskCanvas, 0, 0)
      activeCtx.globalCompositeOperation = 'source-over'

      ctx.drawImage(activeCanvas, 0, 0)
      if (displayState.kind === 'shapes' && !hasNotifiedReveal) {
        hasNotifiedReveal = true
        revealFrameId = window.requestAnimationFrame(() => {
          revealPaintFrameId = window.requestAnimationFrame(() => {
            onRevealCompleteRef.current?.()
          })
        })
      }
      if (displayState.kind === 'letters' && displayState.text === TITLE_TEXT && !hasNotifiedResolve) {
        hasNotifiedResolve = true
        resolveFrameId = window.requestAnimationFrame(() => {
          resolvePaintFrameId = window.requestAnimationFrame(() => {
            onResolveCompleteRef.current?.()
          })
        })
      }

      animationFrameId = window.requestAnimationFrame(drawFrame)
    }

    animationFrameId = window.requestAnimationFrame(drawFrame)

    return () => {
      window.cancelAnimationFrame(animationFrameId)
      window.cancelAnimationFrame(revealFrameId)
      window.cancelAnimationFrame(revealPaintFrameId)
      window.cancelAnimationFrame(resolveFrameId)
      window.cancelAnimationFrame(resolvePaintFrameId)
    }
  }, [fontLoaded, maxWidth, shapeGlyphs, shouldPlayIntro, shouldResolveToTitle])

  if (!fontLoaded) {
    return (
      <div
        className={className}
        style={{
          width: '100%',
          maxWidth: `${maxWidth}px`,
          aspectRatio,
        }}
      />
    )
  }

  return (
    <div
      className={`animated-title ${className}`}
      style={{
        width: '100%',
        maxWidth: `${maxWidth}px`,
        aspectRatio,
      }}
    >
      <canvas ref={canvasRef} aria-label="Unkind" />
    </div>
  )
}
