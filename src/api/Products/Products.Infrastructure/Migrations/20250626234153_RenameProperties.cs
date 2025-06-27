using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Products.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RenameProperties : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Barcode",
                schema: "products",
                table: "Products",
                newName: "BarCode");

            migrationBuilder.RenameColumn(
                name: "Quantity",
                schema: "products",
                table: "Products",
                newName: "Stock");

            migrationBuilder.RenameIndex(
                name: "IX_Products_Barcode",
                schema: "products",
                table: "Products",
                newName: "IX_Products_BarCode");

            migrationBuilder.RenameColumn(
                name: "Quantity",
                schema: "products",
                table: "Boxes",
                newName: "Stock");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "BarCode",
                schema: "products",
                table: "Products",
                newName: "Barcode");

            migrationBuilder.RenameColumn(
                name: "Stock",
                schema: "products",
                table: "Products",
                newName: "Quantity");

            migrationBuilder.RenameIndex(
                name: "IX_Products_BarCode",
                schema: "products",
                table: "Products",
                newName: "IX_Products_Barcode");

            migrationBuilder.RenameColumn(
                name: "Stock",
                schema: "products",
                table: "Boxes",
                newName: "Quantity");
        }
    }
}
