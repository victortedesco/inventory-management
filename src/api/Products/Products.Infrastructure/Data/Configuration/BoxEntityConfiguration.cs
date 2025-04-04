using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Products.Domain.Models;

namespace Products.Infrastructure.Data.Configuration;

internal class BoxEntityConfiguration : IEntityTypeConfiguration<Box>
{
    public void Configure(EntityTypeBuilder<Box> builder)
    {
        builder.ToTable("Boxes");

        builder.HasKey(b => b.Id);

        builder.Property(b => b.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(b => b.CreatedBy)
            .IsRequired();

        builder.Property(b => b.UpdatedBy)
            .IsRequired();

        builder.Property(b => b.CreatedAt)
            .HasDefaultValueSql("GETUTCDATE()")
            .ValueGeneratedOnAdd();

        builder.Property(b => b.UpdatedAt)
            .HasDefaultValueSql("GETUTCDATE()")
            .ValueGeneratedOnAddOrUpdate();

        builder.Property(b => b.Quantity)
            .IsRequired();

        builder.Property(b => b.Discount)
            .HasColumnType("decimal(18,2)")
            .IsRequired();

        builder.Property(b => b.Weight)
            .IsRequired();

        builder.Property(b => b.Depth)
            .IsRequired();

        builder.Property(b => b.Height)
            .IsRequired();

        builder.Property(b => b.Width)
            .IsRequired();

        builder.HasMany(b => b.Products)
            .WithOne()
            .OnDelete(DeleteBehavior.Cascade);
    }
}
