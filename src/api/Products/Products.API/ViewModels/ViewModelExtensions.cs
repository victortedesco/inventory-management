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
            BarCode = product.BarCode,
            Stock = product.Stock,
            TotalStock = product.TotalStock,
            Category = product.Category?.ToViewModel(),
        };
    }

    public static IEnumerable<ProductViewModel> ToViewModel(this IEnumerable<ProductDTO> products)
    {
        return products.Select(ToViewModel);
    }

    public static ProductWithBoxesViewModel ToViewModelWithBoxes(
       this ProductDTO product,
       IEnumerable<BoxDTO> boxes)
    {
        return new ProductWithBoxesViewModel
        {
            Product = product.ToViewModel(),
            Boxes = boxes.ToViewModel()
        };
    }

    public static BoxViewModel ToViewModel(this BoxDTO box)
    {
        return new BoxViewModel
        {
            Id = box.Id,
            BarCode = box.BarCode,
            Name = box.Name,
            Discount = box.Discount,
            UnitPrice = box.UnitPrice,
            Stock = box.Stock,
            Weight = box.Weight,
            Depth = box.Depth,
            Height = box.Height,
            Width = box.Width,
            Products = box.Products.Select(p => p.ToViewModel()).ToList(),
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

    public static ProductInBoxViewModel ToViewModel(this ProductInBoxDTO productInBox)
    {
        return new ProductInBoxViewModel
        {
            BoxId = productInBox.BoxId,
            ProductId = productInBox.Product.Id,
            Quantity = productInBox.Quantity,
            Product = productInBox.Product.ToViewModel()
        };
    }
    public static IEnumerable<ProductInBoxViewModel> ToViewModel(this IEnumerable<ProductInBoxDTO> productsInBox)
    {
        return productsInBox.Select(ToViewModel);
    }
}
