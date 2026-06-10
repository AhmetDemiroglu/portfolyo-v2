import AppKit

let canvasWidth: CGFloat = 1200
let canvasHeight: CGFloat = 630

func color(_ red: CGFloat, _ green: CGFloat, _ blue: CGFloat, _ alpha: CGFloat = 1) -> NSColor {
    NSColor(
        calibratedRed: red / 255,
        green: green / 255,
        blue: blue / 255,
        alpha: alpha
    )
}

func font(_ name: String, size: CGFloat, fallbackWeight: NSFont.Weight) -> NSFont {
    NSFont(name: name, size: size) ?? NSFont.systemFont(ofSize: size, weight: fallbackWeight)
}

func drawText(
    _ text: String,
    x: CGFloat,
    top: CGFloat,
    width: CGFloat,
    font: NSFont,
    color: NSColor,
    lineHeight: CGFloat? = nil
) {
    let paragraph = NSMutableParagraphStyle()
    paragraph.lineBreakMode = .byWordWrapping
    paragraph.minimumLineHeight = lineHeight ?? font.pointSize * 1.15
    paragraph.maximumLineHeight = lineHeight ?? font.pointSize * 1.15

    let attributes: [NSAttributedString.Key: Any] = [
        .font: font,
        .foregroundColor: color,
        .paragraphStyle: paragraph,
    ]
    let attributed = NSAttributedString(string: text, attributes: attributes)
    let measured = attributed.boundingRect(
        with: NSSize(width: width, height: canvasHeight),
        options: [.usesLineFragmentOrigin, .usesFontLeading]
    )
    let rect = NSRect(
        x: x,
        y: canvasHeight - top - ceil(measured.height),
        width: width,
        height: ceil(measured.height)
    )
    attributed.draw(with: rect, options: [.usesLineFragmentOrigin, .usesFontLeading])
}

let scriptURL = URL(fileURLWithPath: CommandLine.arguments[0]).standardizedFileURL
let projectURL = scriptURL.deletingLastPathComponent().deletingLastPathComponent()
let portraitURL = projectURL.appendingPathComponent("public/ahmet-.webp")
let outputURL = projectURL.appendingPathComponent("public/og-image.png")

guard let portrait = NSImage(contentsOf: portraitURL) else {
    fputs("Could not load portrait at \(portraitURL.path)\n", stderr)
    exit(1)
}

guard
    let bitmap = NSBitmapImageRep(
        bitmapDataPlanes: nil,
        pixelsWide: Int(canvasWidth),
        pixelsHigh: Int(canvasHeight),
        bitsPerSample: 8,
        samplesPerPixel: 4,
        hasAlpha: true,
        isPlanar: false,
        colorSpaceName: .deviceRGB,
        bytesPerRow: 0,
        bitsPerPixel: 0
    ),
    let graphicsContext = NSGraphicsContext(bitmapImageRep: bitmap)
else {
    fputs("Could not create social image canvas\n", stderr)
    exit(1)
}

NSGraphicsContext.saveGraphicsState()
NSGraphicsContext.current = graphicsContext

color(245, 243, 238).setFill()
NSRect(x: 0, y: 0, width: canvasWidth, height: canvasHeight).fill()

color(213, 209, 199, 0.42).setStroke()
for x in stride(from: CGFloat(0), through: canvasWidth, by: 72) {
    let line = NSBezierPath()
    line.move(to: NSPoint(x: x, y: 0))
    line.line(to: NSPoint(x: x, y: canvasHeight))
    line.lineWidth = 1
    line.stroke()
}
for y in stride(from: CGFloat(0), through: canvasHeight, by: 72) {
    let line = NSBezierPath()
    line.move(to: NSPoint(x: 0, y: y))
    line.line(to: NSPoint(x: canvasWidth, y: y))
    line.lineWidth = 1
    line.stroke()
}

color(226, 84, 14, 0.12).setFill()
NSBezierPath(ovalIn: NSRect(x: 1020, y: 500, width: 220, height: 220)).fill()

let accentBar = NSBezierPath(
    roundedRect: NSRect(x: 72, y: 526, width: 76, height: 7),
    xRadius: 3.5,
    yRadius: 3.5
)
color(226, 84, 14).setFill()
accentBar.fill()

drawText(
    "PORTFOLYO",
    x: 72,
    top: 116,
    width: 620,
    font: font("Avenir Next Medium", size: 18, fallbackWeight: .medium),
    color: color(226, 84, 14)
)
drawText(
    "Ahmet Demiroğlu",
    x: 72,
    top: 158,
    width: 650,
    font: font("Avenir Next Bold", size: 62, fallbackWeight: .bold),
    color: color(26, 28, 33),
    lineHeight: 70
)
drawText(
    "Full-Stack Developer",
    x: 72,
    top: 238,
    width: 650,
    font: font("Avenir Next Demi Bold", size: 36, fallbackWeight: .semibold),
    color: color(226, 84, 14),
    lineHeight: 42
)
drawText(
    "Dijital ürünleri şehir kurar gibi inşa ediyorum.\nReact, Vue, .NET ve mobil uygulamalar.",
    x: 72,
    top: 320,
    width: 620,
    font: font("Avenir Next Regular", size: 27, fallbackWeight: .regular),
    color: color(73, 78, 90),
    lineHeight: 38
)
drawText(
    "ahmetdemiroglu.dev",
    x: 72,
    top: 528,
    width: 620,
    font: font("Menlo Regular", size: 19, fallbackWeight: .medium),
    color: color(124, 130, 142)
)

let portraitFrame = NSRect(x: 782, y: 48, width: 350, height: 534)
let framePath = NSBezierPath(roundedRect: portraitFrame, xRadius: 38, yRadius: 38)
NSGraphicsContext.saveGraphicsState()
framePath.addClip()
color(252, 251, 248).setFill()
portraitFrame.fill()
portrait.draw(
    in: portraitFrame,
    from: NSRect(origin: .zero, size: portrait.size),
    operation: .sourceOver,
    fraction: 1
)
NSGraphicsContext.restoreGraphicsState()

color(226, 84, 14, 0.72).setStroke()
framePath.lineWidth = 3
framePath.stroke()

NSGraphicsContext.restoreGraphicsState()

guard
    let png = bitmap.representation(using: .png, properties: [:])
else {
    fputs("Could not encode social image\n", stderr)
    exit(1)
}

try png.write(to: outputURL)
print("Wrote \(outputURL.path)")
