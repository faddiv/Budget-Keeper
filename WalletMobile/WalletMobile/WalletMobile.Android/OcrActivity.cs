using Android.App;
using Android.Content;
using Android.Gms.Vision;
using Android.Gms.Vision.Texts;
using Android.OS;
using Android.Runtime;
using Android.Util;
using Android.Widget;
using System;

namespace WalletMobile.Droid
{
    [Activity(Label = "Text Recognizer")]
    public class OcrActivity : Activity
    {
        CameraSource mCameraSource;
        CameraSourcePreview mPreview;
        GraphicOverlay mGraphicOverlay;

        protected override void OnCreate(Bundle bundle)
        {
            base.OnCreate(bundle);

            SetContentView(Resource.Layout.FaceTracker);

            mPreview = FindViewById<CameraSourcePreview>(Resource.Id.preview);
            mGraphicOverlay = FindViewById<GraphicOverlay>(Resource.Id.faceOverlay);

            CreateCameraSource(true, false);
        }
        private void CreateCameraSource(bool autoFocus, bool useFlash)
        {
            var context = Application.Context;

            // TODO: Create the TextRecognizer
            var textRecognizer = new TextRecognizer.Builder(context).Build();
            // TODO: Set the TextRecognizer's Processor.
            textRecognizer.SetProcessor(
                new MultiProcessor.Builder(new OcrDetectorProcessorFactory(mGraphicOverlay)).Build());
            // TODO: Check if the TextRecognizer is operational.

            if (!textRecognizer.IsOperational)
            {
                var lowstorageFilter = new IntentFilter(Intent.ActionDeviceStorageLow);
                var hasLowStorage = RegisterReceiver(null, lowstorageFilter) != null;

                if (hasLowStorage)
                {
                    Toast.MakeText(this, "Low storage error", ToastLength.Long).Show();
                }
            }
            // TODO: Create the cameraSource using the TextRecognizer.
            var cameraSourceBuilder = new CameraSource.Builder(context, textRecognizer)
                .SetFacing(CameraFacing.Back)
                .SetRequestedPreviewSize(1280, 1024)
                .SetRequestedFps(15)
                .SetAutoFocusEnabled(autoFocus);
            mCameraSource = cameraSourceBuilder.Build();
        }

        protected override void OnResume()
        {
            base.OnResume();

            StartCameraSource();
        }

        protected override void OnPause()
        {
            base.OnPause();

            mPreview.Stop();
        }

        /**
     * Starts or restarts the camera source, if it exists.  If the camera source doesn't exist yet
     * (e.g., because onResume was called before the camera source was created), this will be called
     * again when the camera source is created.
     */
        void StartCameraSource()
        {
            try
            {
                mPreview.Start(mCameraSource, mGraphicOverlay);
            }
            catch (System.Exception e)
            {
                Android.Util.Log.Error("OCR", "Unable to start camera source.", e);
                mCameraSource.Release();
                mCameraSource = null;
            }
        }
        public class OcrDetectorProcessorFactory : Java.Lang.Object, MultiProcessor.IFactory
        {
            public OcrDetectorProcessorFactory(GraphicOverlay ocrGraphicOverlay)
            {
                Overlay = ocrGraphicOverlay;
            }

            public GraphicOverlay Overlay { get; }

            public Tracker Create(Java.Lang.Object item)
            {
                return new OcrDetectorTracker(Overlay);
            }
        }
        public class OcrDetectorTracker : Tracker
        {
            OcrGraphic ocrGraphic;
            public OcrDetectorTracker(GraphicOverlay ocrGraphicOverlay)
            {
                mOverlay = ocrGraphicOverlay;
                ocrGraphic = new OcrGraphic(mOverlay);
            }

            // TODO:  Once this implements Detector.Processor<TextBlock>, implement the abstract methods.

            public GraphicOverlay mOverlay { get; private set; }

            /**
            * Start tracking the detected face instance within the face overlay.
            */
            public override void OnNewItem(int idValue, Java.Lang.Object item)
            {
                ocrGraphic.Id = idValue;
            }

            /**
            * Update the position/characteristics of the face within the overlay.
            */
            public override void OnUpdate(Detector.Detections detections, Java.Lang.Object item)
            {
                mOverlay.Add(ocrGraphic);
                ocrGraphic.UpdateText(item.JavaCast<TextBlock>());
            }

            /**
            * Hide the graphic when the corresponding face was not detected.  This can happen for
            * intermediate frames temporarily (e.g., if the face was momentarily blocked from
            * view).
            */
            public override void OnMissing(Detector.Detections detections)
            {
                mOverlay.Remove(ocrGraphic);
            }

            /**
            * Called when the face is assumed to be gone for good. Remove the graphic annotation from
            * the overlay.
            */
            public override void OnDone()
            {
                mOverlay.Remove(ocrGraphic);
            }
        }
    }
}