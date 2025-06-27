using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Products.Domain.Models;

namespace Products.Infrastructure.Data.Configuration;

internal class ProductEntityConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.ToTable("Products");

        builder.HasKey(b => b.Id);

        builder.Property(b => b.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.HasIndex(b => b.Name)
            .IsUnique();

        builder.Property(b => b.BarCode)
            .IsRequired()
            .HasMaxLength(13);

        builder.HasIndex(b => b.BarCode)
            .IsUnique();

        builder.Property(p => p.Image)
            .IsRequired();

        builder.Property(p => p.UnitPrice)
            .IsRequired()
            .HasColumnType("decimal(18,2)")
            .HasDefaultValue(0);

        builder.Property(p => p.Stock)
            .IsRequired()
            .HasDefaultValue(0);

        builder.HasOne(p => p.Category)
            .WithMany(c => c.Products)
            .HasForeignKey("CategoryId");

        builder.HasMany(p => p.ProductInBoxes)
            .WithOne(pib => pib.Product)
            .HasForeignKey(pib => pib.ProductId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
