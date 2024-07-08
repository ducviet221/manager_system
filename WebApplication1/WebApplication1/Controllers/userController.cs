using System.Data;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using WebApplication1.Model;

[ApiController]
[Route("/api/[controller]")]
public class userController : ControllerBase
{
    private readonly IConfiguration configuration;

    public userController(IConfiguration configuration)
    {
        this.configuration = configuration;
    }


    [HttpGet("user")]
    public async Task<IEnumerable<UserModel>> Get()
    {
        return await GetUser();
    }

    private  async Task<IEnumerable<UserModel>> GetUser()
    {
        List<UserModel> userList = new List<UserModel>();
        var connectionString = configuration.GetConnectionString("ConnectionStrings");
        using (MySqlConnection connection = new MySqlConnection(connectionString))
        {
            await connection.OpenAsync();

            string query = "SELECT * FROM myusers";
            MySqlCommand command = new MySqlCommand(query, connection);

            using (var reader = await command.ExecuteReaderAsync())
            {

                while (await reader.ReadAsync())
                {
                    UserModel user = new UserModel
                    {
                        Id = reader.GetInt32("id"),
                        CreatedDate = reader.IsDBNull("createdDate") ? (DateTime?)null : reader.GetDateTime("createdDate"),
                        password = reader.GetString("password"),
                        userName = reader.GetString("userName")
                    };
                    userList.Add(user);
                }
            }
        }

        return userList;
    }


    [HttpPost("createuser")]
    public async Task<BaseResponse> CreateUser([FromBody] UserModel userModel)
    {
        try
        {
            // Kiểm tra xem tài khoản đã tồn tại chưa
            if (await CheckUserExistsAsync(userModel.userName))
            {
                return new BaseResponse()
                {
                    result = null,
                    status = false

                };
            }

            await CreateUserAsync(userModel);
            return new BaseResponse()
            {
                result = userModel,
                status = true

            }; ;
        }
        catch (Exception ex)
        {
             return new BaseResponse()
            {
                result = null,
                status = false,
                message = ex.Message

            }; ;
        }
    }

    private  async Task<bool> CheckUserExistsAsync(string userName)
    {
        var connectionString = configuration.GetConnectionString("ConnectionStrings");
        using (MySqlConnection connection = new MySqlConnection(connectionString))
        {
            await connection.OpenAsync();

            string query = "SELECT COUNT(*) FROM MyUsers WHERE userName = @userName";
            MySqlCommand command = new MySqlCommand(query, connection);
            command.Parameters.AddWithValue("@userName", userName);

            int count = Convert.ToInt32(await command.ExecuteScalarAsync());
            return count > 0;
        }
    }

    private  async Task CreateUserAsync(UserModel userModel)
    {
        var connectionString = configuration.GetConnectionString("ConnectionStrings");
        using (MySqlConnection connection = new MySqlConnection(connectionString))
        {
            await connection.OpenAsync();

            string query = "INSERT INTO MyUsers (Id, CreatedDate, userName, password) VALUES (@Id, @CreatedDate, @userName, @password)";
            MySqlCommand command = new MySqlCommand(query, connection);

            command.Parameters.AddWithValue("@Id", userModel.Id);
            command.Parameters.AddWithValue("@CreatedDate", DateTime.Now);
            command.Parameters.AddWithValue("@userName", userModel.userName);
            command.Parameters.AddWithValue("@password", userModel.password);

            await command.ExecuteNonQueryAsync();
        }
    }


    [HttpPost("login")]
    public async Task<BaseResponse> Login([FromBody] UserModel userModel )
    {
        try
        {
            // Kiểm tra xem người dùng đã đăng ký chưa
            var user =  await  GetUserByUsernameAsync(userModel.userName, userModel.password);
            if (user == null)
            {
                return new BaseResponse()
                {
                    result = null,
                    status = false

                };
            }

            // Kiểm tra mật khẩu


            // Trả về token
            return new BaseResponse()
            {
                result = user,
                status = true

            };
        }
        catch (Exception ex)
        {
            return new BaseResponse()
            {
                message = ex.Message,
                result = null,
                status = false
            };
        }
    }

    private async Task<UserModel> GetUserByUsernameAsync(string username, string password)
    {
        var connectionString = configuration.GetConnectionString("ConnectionStrings");
        using (MySqlConnection connection = new MySqlConnection(connectionString))
        {
            await connection.OpenAsync();

            string query = "SELECT * FROM MyUsers WHERE userName = @Username and password = @password";
            MySqlCommand command = new MySqlCommand(query, connection);
            command.Parameters.AddWithValue("@Username", username);
            command.Parameters.AddWithValue("@password", password);
            using (var reader = await command.ExecuteReaderAsync())
            {
                if (await reader.ReadAsync())
                {
                    return new UserModel
                    {
                        Id = reader.GetInt32("Id"),
                        userName = reader.GetString("userName"),
                        password = reader.GetString("password"), 
                        CreatedDate = reader.GetDateTime("createdDate")
                    };
                }
                else
                {
                    return null;
                }
            }
        }
    }

   
}

