using Products.Infrastructure.DTO;

namespace Products.API.ViewModels;

public static class ViewModelExtensions
{
    public static CategoryViewModel ToViewModel(this CategoryDTO category)
    {
        return new CategoryViewModel
        {
            Id = category.Id,
            Name = category.Name,
            TotalStock = category.TotalStock,
            ProductCount = category.ProductCount,
            Value = category.Value,
        };
    }

    public static IEnumerable<CategoryViewModel> ToViewModel(this IEnumerable<CategoryDTO> categories)
    {
        return categories.Select(ToViewModel);
    }

    public static ProductViewModel ToViewModel(this ProductDTO product)
    {
        return new ProductViewModel
        {
            Id = product.Id,
            Name = product.Name,
            Image = product.Image,
            UnitPrice = product.UnitPrice,
            Barcode = product.Barcode,
            Quantity = product.Quantity,
            Category = product.Category?.ToViewModel(),
        };
    }

    public static IEnumerable<ProductViewModel> ToViewModel(this IEnumerable<ProductDTO> products)
    {
        return products.Select(ToViewModel);
    }

    public static BoxViewModel ToViewModel(this BoxDTO box)
    {
        return new BoxViewModel
        {
            Id = box.Id,
            Name = box.Name,
            Discount = box.Discount,
            UnitPrice = box.UnitPrice,
            Quantity = box.Quantity,
            Weight = box.Weight,
            Depth = box.Depth,
            Height = box.Height,
            Width = box.Width,
            Products = box.Products.ToViewModel(),
        };
    }

    public static IEnumerable<BoxViewModel> ToViewModel(this IEnumerable<BoxDTO> boxes)
    {
        return boxes.Select(ToViewModel);
    }

    public static AuditLogViewModel ToViewModel(this AuditLogDTO auditLog)
    {
        return new AuditLogViewModel
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

    public static IEnumerable<AuditLogViewModel> ToViewModel(this IEnumerable<AuditLogDTO> auditLogs)
    {
        return auditLogs.Select(ToViewModel);
    }
}
