Add-Type -AssemblyName System.Drawing
$size = 256
$bmp = New-Object System.Drawing.Bitmap $size, $size
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.Clear([System.Drawing.Color]::Transparent)
$blue = [System.Drawing.ColorTranslator]::FromHtml('#1a73e8')
$darkBlue = [System.Drawing.ColorTranslator]::FromHtml('#174ea6')
$white = [System.Drawing.Color]::White
$line = [System.Drawing.ColorTranslator]::FromHtml('#dadce0')
$outer = New-Object System.Drawing.Rectangle 28, 34, 200, 184
$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$radius = 22
$path.AddArc($outer.X, $outer.Y, $radius, $radius, 180, 90)
$path.AddArc($outer.Right - $radius, $outer.Y, $radius, $radius, 270, 90)
$path.AddArc($outer.Right - $radius, $outer.Bottom - $radius, $radius, $radius, 0, 90)
$path.AddArc($outer.X, $outer.Bottom - $radius, $radius, $radius, 90, 90)
$path.CloseFigure()
$g.FillPath((New-Object System.Drawing.SolidBrush $white), $path)
$g.DrawPath((New-Object System.Drawing.Pen $darkBlue, 8), $path)
$header = New-Object System.Drawing.Rectangle 28, 34, 200, 54
$headerPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$headerPath.AddArc($header.X, $header.Y, $radius, $radius, 180, 90)
$headerPath.AddArc($header.Right - $radius, $header.Y, $radius, $radius, 270, 90)
$headerPath.AddLine($header.Right, $header.Bottom, $header.X, $header.Bottom)
$headerPath.CloseFigure()
$g.FillPath((New-Object System.Drawing.SolidBrush $blue), $headerPath)
$ringPen = New-Object System.Drawing.Pen $white, 12
$ringPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$ringPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$g.DrawLine($ringPen, 78, 24, 78, 54)
$g.DrawLine($ringPen, 178, 24, 178, 54)
$gridPen = New-Object System.Drawing.Pen $line, 4
foreach ($x in 82, 128, 174) { $g.DrawLine($gridPen, $x, 112, $x, 194) }
foreach ($y in 126, 160) { $g.DrawLine($gridPen, 58, $y, 198, $y) }
$today = New-Object System.Drawing.Rectangle 132, 164, 40, 28
$todayPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$todayPath.AddArc($today.X, $today.Y, 10, 10, 180, 90)
$todayPath.AddArc($today.Right - 10, $today.Y, 10, 10, 270, 90)
$todayPath.AddArc($today.Right - 10, $today.Bottom - 10, 10, 10, 0, 90)
$todayPath.AddArc($today.X, $today.Bottom - 10, 10, 10, 90, 90)
$todayPath.CloseFigure()
$g.FillPath((New-Object System.Drawing.SolidBrush $blue), $todayPath)
$g.Dispose()
$pngPath = Join-Path (Get-Location) 'build\icon.png'
$icoPath = Join-Path (Get-Location) 'build\icon.ico'
$bmp.Save($pngPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$pngBytes = [System.IO.File]::ReadAllBytes($pngPath)
$fs = [System.IO.File]::Create($icoPath)
$bw = New-Object System.IO.BinaryWriter $fs
$bw.Write([UInt16]0)
$bw.Write([UInt16]1)
$bw.Write([UInt16]1)
$bw.Write([Byte]0)
$bw.Write([Byte]0)
$bw.Write([Byte]0)
$bw.Write([Byte]0)
$bw.Write([UInt16]1)
$bw.Write([UInt16]32)
$bw.Write([UInt32]$pngBytes.Length)
$bw.Write([UInt32]22)
$bw.Write($pngBytes)
$bw.Close()
$fs.Close()
