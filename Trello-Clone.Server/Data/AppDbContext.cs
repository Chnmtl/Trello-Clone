using System.Collections.Generic;
using Trello_Clone.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Trello_Clone.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Board> Boards { get; set; }
        // Add other DbSets (e.g., Tasks)
    }
}

