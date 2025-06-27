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
            BarCode = product.BarCode,
            Stock = product.Stock,
            TotalStock = product.GetTotalStock(),
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
            TotalStock = (int)category.Products.Sum(p => p.Stock),
            ProductCount = category.Products.Count,
            Value = category.Products.Sum(p => p.UnitPrice * p.Stock),
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
            BarCode = box.BarCode,
            Name = box.Name,
            Discount = box.Discount,
            UnitPrice = box.Products.Select(b => b.Product).Sum(p => p.UnitPrice),
            Stock = box.Stock,
            Weight = box.Weight,
            Depth = box.Depth,
            Height = box.Height,
            Width = box.Width,
            Products = box.Products.Select(bp => bp.ToDTO()).ToList()
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

    public static ProductInBoxDTO ToDTO(this ProductInBox productInBox)
    {
        return new ProductInBoxDTO
        {
            Product = productInBox.Product.ToDTO(),
            BoxId = productInBox.BoxId,
            Quantity = productInBox.Quantity
        };
    }

    public static IEnumerable<ProductInBoxDTO> ToDTO(this IEnumerable<ProductInBox> productInBoxes)
    {
        return productInBoxes.Select(ToDTO);
    }
}
