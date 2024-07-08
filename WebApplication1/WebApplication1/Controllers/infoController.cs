using System.Data;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using MySqlX.XDevAPI.Common;
using WebApplication1.Model;

[ApiController]
[Route("/api/[controller]")]
public class infoController : ControllerBase
{
   private readonly IConfiguration configuration;

    public infoController(IConfiguration configuration)
    {
        this.configuration = configuration;
    }

    [HttpGet("getListInfo")]
    public async Task<BaseResponse> Get()
    {
        try
        {
            var result = await GetListInfo();
            return new BaseResponse()
            {
                result = result,
                status = true
            };
        }
        catch(Exception ex)
        {
            return new BaseResponse()
            {
                result = null,
                status = true, 
                message = ex.Message
            };
        }
       
    }

    private async Task<IEnumerable<InfoModel>> GetListInfo()
    {
        List<InfoModel> infoList = new List<InfoModel>();
        var connectionString = configuration.GetConnectionString("ConnectionStrings");
        using (MySqlConnection connection = new MySqlConnection(connectionString))
        {
            await connection.OpenAsync();

            string query = "SELECT * FROM listinfo";
            MySqlCommand command = new MySqlCommand(query, connection);

            using (var reader = await command.ExecuteReaderAsync())
            {

                while (await reader.ReadAsync())
                {
                    InfoModel info = new InfoModel()
                    {
                        Id = reader.GetInt32("Id"),
                        Cif = reader.IsDBNull("Cif") ? null : reader.GetString("Cif"),
                        Affarisofficer = reader.IsDBNull("Affarisofficer") ? null : reader.GetString("Affarisofficer"),
                        Date = reader.IsDBNull("Date") ? (DateTime?)null : reader.GetDateTime("Date"),
                        Deliveryroom = reader.IsDBNull("Deliveryroom") ? null :  reader.GetString("Deliveryroom"),
                        Name = reader.IsDBNull("Name") ? null :  reader.GetString("Name"),
                        Note = reader.IsDBNull("Note") ? null : reader.GetString("Note"),
                        Recive = reader.IsDBNull("Recive") ? null :  reader.GetString("Recive"),
                        Status = reader.IsDBNull("Status") ? 1000001 : reader.GetInt32("Status")
                    };
                    infoList.Add(info);
                }
            }
        }

        return infoList;
    }

    [HttpPost("createInfo")]
    public async Task<BaseResponse> CreateInfo([FromBody] InfoModel infoModel)
    {
        try
        {
           
            await CreateInfoAsync(infoModel);
            return new BaseResponse()
            {
                result = infoModel,
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

 
    private  async Task CreateInfoAsync(InfoModel infoModel)
    {
        var connectionString = configuration.GetConnectionString("ConnectionStrings");
        using (MySqlConnection connection = new MySqlConnection(connectionString))
        {
            await connection.OpenAsync();

            string query = "INSERT INTO listInfo (Id, CreatedDate, UpdatedDate, cif,name,Deliveryroom,Affarisofficer,Recive, Status, Note, Date ) VALUES (null, @CreatedDate, @UpdatedDate,@cif ,@name,@Deliveryroom ,@Affarisofficer,@Recive,@Status,@Note,@Date)";
            MySqlCommand command = new MySqlCommand(query, connection);

            command.Parameters.AddWithValue("@CreatedDate", DateTime.Now);
            command.Parameters.AddWithValue("@UpdatedDate", DateTime.Now);
            command.Parameters.AddWithValue("@cif", infoModel.Cif);
            command.Parameters.AddWithValue("@name", infoModel.Name);
            command.Parameters.AddWithValue("@Deliveryroom", infoModel.Deliveryroom);
            command.Parameters.AddWithValue("@Affarisofficer", infoModel.Affarisofficer);
            command.Parameters.AddWithValue("@Recive", infoModel.Recive);
            command.Parameters.AddWithValue("@Status", 1000001);
            command.Parameters.AddWithValue("@Note", infoModel.Note);
            command.Parameters.AddWithValue("@Date", infoModel.Date);
            await command.ExecuteNonQueryAsync();
        }
    }


   
   
    [HttpPut("updateInfo")]
    public async Task<BaseResponse> UpdateInfoAsync(InfoModel info)
    {
        try
        {
            var connectionString = configuration.GetConnectionString("ConnectionStrings");
            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                await connection.OpenAsync();

                string query = "UPDATE listInfo SET Cif = @Cif, Name = @Name, Deliveryroom = @Deliveryroom, " +
                               "Affarisofficer = @Affarisofficer, Recive = @Recive, " +
                               "Note = @Note, Date = @Date WHERE Id = @Id";

                MySqlCommand command = new MySqlCommand(query, connection);
                command.Parameters.AddWithValue("@Cif", info.Cif);
                command.Parameters.AddWithValue("@Name", info.Name);
                command.Parameters.AddWithValue("@Deliveryroom", info.Deliveryroom);
                command.Parameters.AddWithValue("@Affarisofficer", info.Affarisofficer);
                command.Parameters.AddWithValue("@Recive", info.Recive);
                command.Parameters.AddWithValue("@Note", info.Note);
                command.Parameters.AddWithValue("@Date", info.Date);
                command.Parameters.AddWithValue("@Id", info.Id);

                int rowsAffected = await command.ExecuteNonQueryAsync();
                return new BaseResponse()
                {
                    result = info,
                    status = rowsAffected > 0,


                };
            }
        }
        catch (Exception ex)
        {
            // Handle exception
            return new BaseResponse()
            {
                message = "Error Update info by ID:" + ex.Message,
                status = false,
                result = null
            };
            throw new Exception($"Error Update info: {ex.Message}");
        }
    }

    [HttpGet("deleteInfo/{id}")]
    public async Task<BaseResponse> DeleteInfoAsync(int id)
    {
        try
        {
            var connectionString = configuration.GetConnectionString("ConnectionStrings");
            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                await connection.OpenAsync();
                string query = "DELETE FROM listInfo WHERE Id = @Id";
                MySqlCommand command = new MySqlCommand(query, connection);
                command.Parameters.AddWithValue("@Id", id);

                int rowsAffected = await command.ExecuteNonQueryAsync();
                return new BaseResponse()
                {
                    result = rowsAffected > 0,
                    status = rowsAffected > 0,


                };
            }
        }
        catch (Exception ex)
        {
            // Handle exception
            return new BaseResponse()
            {
                message = "Error Delete info by ID:" + ex.Message,
                status = false,
                result = null
            };
            throw new Exception($"Error deleting info: {ex.Message}");
        }
    }

    [HttpGet("getInfoDetail/{id}")]
    public async Task<BaseResponse> GetInfoByIdAsync(int id)
    {
        try
        {
            var connectionString = configuration.GetConnectionString("ConnectionStrings");
            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                await connection.OpenAsync();

                string query = "SELECT Id, Cif, Name, Deliveryroom, Affarisofficer, Recive, Status, Note, Date " +
                               "FROM listInfo WHERE Id = @Id";

                MySqlCommand command = new MySqlCommand(query, connection);
                command.Parameters.AddWithValue("@Id", id);

                using (var reader = await command.ExecuteReaderAsync())
                {
                    if (await reader.ReadAsync())
                    {
                        return new BaseResponse()
                        {
                            result = new InfoModel
                            {
                                Id = reader.GetInt32("Id"),
                                Cif = reader.IsDBNull("Cif") ? null : reader.GetString("Cif"),
                                Affarisofficer = reader.IsDBNull("Affarisofficer") ? null : reader.GetString("Affarisofficer"),
                                Date = reader.IsDBNull("Date") ? (DateTime?)null : reader.GetDateTime("Date"),
                                Deliveryroom = reader.IsDBNull("Deliveryroom") ? null : reader.GetString("Deliveryroom"),
                                Name = reader.IsDBNull("Name") ? null : reader.GetString("Name"),
                                Note = reader.IsDBNull("Note") ? null : reader.GetString("Note"),
                                Recive = reader.IsDBNull("Recive") ? null : reader.GetString("Recive"),
                                Status = reader.IsDBNull("Status") ? 1000001 : reader.GetInt32("Status")
                            },
                            status = true
                        };
                    }
                }
            }
        }
        catch (Exception ex)
        {
            // Handle exception
            return new BaseResponse()
            {
                message = "Error getting info by ID:" + ex.Message,
                status = false,
                result = null
            };
            throw new Exception($"Error getting info by ID: {ex.Message}");
        }

        return new BaseResponse()
        {
            status = false,
            result = null
        };
    }

    [HttpGet("completeInfo/{id}")]
    public async Task<BaseResponse> CompleteInfoAsync(int id)
    {
        try
        {
            var connectionString = configuration.GetConnectionString("ConnectionStrings");
            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                await connection.OpenAsync();

                string query = "UPDATE listInfo SET Status = @Status";

                MySqlCommand command = new MySqlCommand(query, connection);
                command.Parameters.AddWithValue("@Status", 1000002);

                int rowsAffected = await command.ExecuteNonQueryAsync();
                return new BaseResponse()
                {
                    result = rowsAffected > 0,
                    status = rowsAffected > 0,


                };
            }
        }
        catch (Exception ex)
        {
            // Handle exception
            return new BaseResponse()
            {
                message = "Error Complete info by ID:" + ex.Message,
                status = false,
                result = null
            };
            throw new Exception($"Error Complete info: {ex.Message}");
        }
    }
}

