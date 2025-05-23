using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Products.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ChangeSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "products");

            migrationBuilder.RenameTable(
                name: "Products",
                newName: "Products",
                newSchema: "products");

            migrationBuilder.RenameTable(
                name: "Categories",
                newName: "Categories",
                newSchema: "products");

            migrationBuilder.RenameTable(
                name: "Boxes",
                newName: "Boxes",
                newSchema: "products");

            migrationBuilder.CreateTable(
                name: "AuditLogs",
                schema: "products",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ActionType = table.Column<int>(type: "integer", nullable: false),
                    EntityType = table.Column<string>(type: "text", nullable: true),
                    EntityName = table.Column<string>(type: "text", nullable: true),
                    EntityId = table.Column<string>(type: "text", nullable: true),
                    Property = table.Column<string>(type: "text", nullable: true),
                    OldValue = table.Column<string>(type: "text", nullable: true),
                    NewValue = table.Column<string>(type: "text", nullable: true),
                    UserId = table.Column<string>(type: "text", nullable: true),
                    Timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditLogs", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AuditLogs",
                schema: "products");

            migrationBuilder.RenameTable(
                name: "Products",
                schema: "products",
                newName: "Products");

            migrationBuilder.RenameTable(
                name: "Categories",
                schema: "products",
                newName: "Categories");

            migrationBuilder.RenameTable(
                name: "Boxes",
                schema: "products",
                newName: "Boxes");
        }
    }
}
