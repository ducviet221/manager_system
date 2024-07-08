namespace WebApplication1.Model
{
    public class BaseResponse
    {
        public Object result { get; set; }

        public bool status { get; set; }

        public string? message { get; set; }
    }
}
