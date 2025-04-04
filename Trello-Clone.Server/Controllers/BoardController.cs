using Microsoft.AspNetCore.Mvc;

namespace Trello_Clone.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BoardController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetTestBoard()
        {
            return Ok(new { Id = 1, Name = "My First Board" });
        }
    }
}
