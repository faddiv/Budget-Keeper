using Android.Gms.Vision.Texts;
using Android.Graphics;

namespace WalletMobile.Droid
{
    internal class OcrGraphic : GraphicOverlay.Graphic
    {
        public int Id { get; set; }

        private static readonly Android.Graphics.Color TEXT_COLOR = Color.White;

        private static Paint rectPaint;
        private static Paint textPaint;

        public TextBlock Text { get; private set; }

        public OcrGraphic(GraphicOverlay overlay)
            : base(overlay)
        {
            // Redraw the overlay, as this graphic has been added.
            PostInvalidate();
        }
        public void UpdateText(TextBlock item)
        {
            Text = item;

            if (rectPaint == null)
            {
                rectPaint = new Paint();
                rectPaint.Color = TEXT_COLOR;
                rectPaint.StrokeWidth = 4.0f;
                rectPaint.SetStyle(Paint.Style.Stroke);
            }

            if (textPaint == null)
            {
                textPaint = new Paint();
                textPaint.Color = TEXT_COLOR;
                textPaint.TextSize = 54.0f;
            }
        }

        public override void Draw(Canvas canvas)
        {
            // TODO: Draw the text onto the canvas.
            if (Text == null)
            {
                return;
            }

            // Draws the bounding box around the TextBlock.
            RectF rect = new RectF(Text.BoundingBox);
            rect = TranslateRect(rect);
            canvas.DrawRect(rect, rectPaint);

            // Render the text at the bottom of the box.
            var pos = rect.Top;
            foreach (var item in Text.Value.Split(new[] { '\n' }, System.StringSplitOptions.RemoveEmptyEntries ))
            {
                pos += textPaint.Descent() - textPaint.Ascent();
                canvas.DrawText(item, rect.Left, pos, textPaint);
            }
            
        }

    }
}