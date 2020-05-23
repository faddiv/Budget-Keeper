using Android.App;
using Android.Content.PM;
using Android.OS;
using Android.Runtime;
using Android.Widget;

namespace WalletMobile.Droid
{

    [Activity(
        Label = "WalletMobile",
        Icon = "@mipmap/icon",
        Theme = "@style/MainTheme",
        MainLauncher = true,
        ConfigurationChanges = ConfigChanges.ScreenSize | ConfigChanges.Orientation
        )]
    public class MainActivity : Activity
    {
        Button buttonFaceTracker;
        Button buttonTextRecognizer;
        Button buttonBarcode;

        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);

            SetContentView(Resource.Layout.main);

            buttonFaceTracker = FindViewById<Button>(Resource.Id.buttonFaceTracker);
            buttonTextRecognizer = FindViewById<Button>(Resource.Id.buttonTextRecognizer);
            buttonBarcode = FindViewById<Button>(Resource.Id.buttonBarcode);

            buttonFaceTracker.Click += delegate {
                StartActivity(typeof(FaceTrackerActivity));
            };

            buttonTextRecognizer.Click += delegate {
                StartActivity(typeof(OcrActivity));
            };

            buttonBarcode.Click += delegate {
                StartActivity(typeof(BarcodeScannerActivity));
            };
        }
        public override void OnRequestPermissionsResult(int requestCode, string[] permissions, [GeneratedEnum] Android.Content.PM.Permission[] grantResults)
        {
            Xamarin.Essentials.Platform.OnRequestPermissionsResult(requestCode, permissions, grantResults);

            base.OnRequestPermissionsResult(requestCode, permissions, grantResults);
        }
    }
}