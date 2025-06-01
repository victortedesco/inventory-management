using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Products.Domain.Models;

namespace Products.Infrastructure.Data.Configuration;

internal class ProductInBoxEntityConfiguration : IEntityTypeConfiguration<ProductInBox>
{
    public void Configure(EntityTypeBuilder<ProductInBox> builder)
    {
        builder.ToTable("ProductsInBoxes");

        builder.HasKey(pib => new { pib.ProductId, pib.BoxId });

        builder.HasOne(pib => pib.Product)
            .WithMany()
            .HasForeignKey(pib => pib.ProductId);

        builder.HasOne(pib => pib.Box)
            .WithMany(b => b.Products)
            .HasForeignKey(pib => pib.BoxId);

        builder.HasOne(pib => pib.Product)
        .WithMany()
        .HasForeignKey(pib => pib.ProductId)
        .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(pib => pib.Box)
         .WithMany(b => b.Products)
         .HasForeignKey(pib => pib.BoxId)
         .OnDelete(DeleteBehavior.Cascade);

    }
}
