using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Users.API.Migrations
{
    /// <inheritdoc />
    public partial class AddRoleEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Role",
                table: "Users");

            migrationBuilder.EnsureSchema(
                name: "users");

            migrationBuilder.RenameTable(
                name: "Users",
                newName: "Users",
                newSchema: "users");

            migrationBuilder.AddColumn<int>(
                name: "RoleId",
                schema: "users",
                table: "Users",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Roles",
                schema: "users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_RoleId",
                schema: "users",
                table: "Users",
                column: "RoleId");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Roles_RoleId",
                schema: "users",
                table: "Users",
                column: "RoleId",
                principalSchema: "users",
                principalTable: "Roles",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Roles_RoleId",
                schema: "users",
                table: "Users");

            migrationBuilder.DropTable(
                name: "Roles",
                schema: "users");

            migrationBuilder.DropIndex(
                name: "IX_Users_RoleId",
                schema: "users",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "RoleId",
                schema: "users",
                table: "Users");

            migrationBuilder.RenameTable(
                name: "Users",
                schema: "users",
                newName: "Users");

            migrationBuilder.AddColumn<string>(
                name: "Role",
                table: "Users",
                type: "text",
                nullable: true);
        }
    }
}
