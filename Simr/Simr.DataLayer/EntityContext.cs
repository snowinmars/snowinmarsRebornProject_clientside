﻿using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Simr.DataLayer.DbEntities;

namespace Simr.DataLayer
{
    public class EntityContext : DbContext
    {
        public EntityContext() : base("SimrDatabase")
        {
        }

        public DbSet<DbAuthor> DbAuthors { get; set; }

        public DbSet<DbBook> DbBooks { get; set; }

        public DbSet<DbUser> DbUsers { get; set; }
    }
}
