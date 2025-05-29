using Products.Domain.Models;

namespace Products.Infrastructure.DTO;

public static class DTOExtensions
{
    public static ProductDTO ToDTO(this Product product)
    {
        return new ProductDTO
        {
            Id = product.Id,
            Name = product.Name,
            Image = product.Image,
            UnitPrice = product.UnitPrice,
            Barcode = product.Barcode,
            Quantity = product.Quantity,
            Category = product.Category?.ToDTO()
        };
    }

    public static IEnumerable<ProductDTO> ToDTO(this IEnumerable<Product> products)
    {
        return products.Select(ToDTO);
    }

    public static CategoryDTO ToDTO(this Category category)
    {
        return new CategoryDTO
        {
            Id = category.Id,
            Name = category.Name,
            ProductCount = category.Products.Count,
            Value = category.Products.Sum(p => p.UnitPrice * p.Quantity),
        };
    }

    public static IEnumerable<CategoryDTO> ToDTO(this IEnumerable<Category> categories)
    {
        return categories.Select(ToDTO);
    }

    public static BoxDTO ToDTO(this Box box)
    {
        return new BoxDTO
        {
            Id = box.Id,
            Name = box.Name,
            Discount = box.Discount,
            UnitPrice = box.Products.Sum(p => p.UnitPrice),
            Quantity = box.Quantity,
            Weight = box.Weight,
            Depth = box.Depth,
            Height = box.Height,
            Width = box.Width,
            Products = box.Products.ToDTO(),
        };
    }

    public static IEnumerable<BoxDTO> ToDTO(this IEnumerable<Box> boxes)
    {
        return boxes.Select(ToDTO);
    }

    public static AuditLogDTO ToDTO(this AuditLog auditLog)
    {
        return new AuditLogDTO
        {
            Id = auditLog.Id,
            EntityId = auditLog.EntityId,
            EntityType = auditLog.EntityType,
            EntityName = auditLog.EntityName,
            ActionType = auditLog.ActionType,
            Property = auditLog.Property,
            OldValue = auditLog.OldValue,
            NewValue = auditLog.NewValue,
            UserId = auditLog.UserId,
            Timestamp = auditLog.Timestamp,
        };
    }

    public static IEnumerable<AuditLogDTO> ToDTO(this IEnumerable<AuditLog> auditLogs)
    {
        return auditLogs.Select(ToDTO);
    }
}
