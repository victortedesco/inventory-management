using Products.Domain.Models;

namespace Products.API.ViewModels;

public class AuditLogViewModel
{
    public int Id { get; set; }
    public AuditActionType ActionType { get; set; }
    public string EntityType { get; set; }
    public string EntityName { get; set; }
    public string EntityId { get; set; }
    public string Property { get; set; }
    public string OldValue { get; set; }
    public string NewValue { get; set; }
    public string UserId { get; set; }
    public DateTime Timestamp { get; set; }
}
