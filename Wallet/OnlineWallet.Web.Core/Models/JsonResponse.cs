namespace OnlineWallet.Web.Models
{
    public class JsonResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
    }
    public class JsonResponse<TData> : JsonResponse
    {
        public JsonResponse()
        {
            
        }

        public JsonResponse(TData data, string message)
        {
            Data = data;
            Success = true;
            Message = message;
        }
        public TData Data { get; set; }
    }
}
