namespace OnlineWallet.Web.Common.Models
{
    public class JsonResponse
    {
        #region Properties

        public string Message { get; set; }
        public bool Success { get; set; }

        #endregion
    }

    public class JsonResponse<TData> : JsonResponse
    {
        #region  Constructors

        public JsonResponse()
        {
        }

        public JsonResponse(TData data, string message)
        {
            Data = data;
            Success = true;
            Message = message;
        }

        #endregion

        #region Properties

        public TData Data { get; set; }

        #endregion
    }
}