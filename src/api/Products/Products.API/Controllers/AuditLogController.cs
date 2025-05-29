using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Products.API.Requests;
using Products.API.ViewModels;
using Products.Domain.Models;
using Products.Infrastructure.Services.Interfaces;

namespace Products.API.Controllers;

[Authorize]
[ApiController]
[Route("api/v1/auditlogs")]
public class AuditLogController(IAuditLogService auditLogService) : ControllerBase
{
    private readonly IAuditLogService _auditLogService = auditLogService;

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(IEnumerable<AuditLogViewModel>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByEntityName([FromQuery] Pagination pagination)
    {
        var auditLogs = await _auditLogService.GetByEntityNameAsync(pagination.Skip, pagination.Take, pagination.Name);
        if (!auditLogs.Any())
            return NoContent();
        return Ok(auditLogs.ToViewModel());
    }

    [HttpGet("entity/{entityId}")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(IEnumerable<AuditLogViewModel>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByEntityId(string entityId, [FromQuery] Pagination pagination)
    {
        var auditLogs = await _auditLogService.GetByEntityIdAsync(pagination.Skip, pagination.Take, entityId);

        if (!auditLogs.Any())
            return NoContent();

        return Ok(auditLogs.ToViewModel());
    }

    [HttpGet("user/{userId}")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(IEnumerable<AuditLogViewModel>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByUserId(string userId, [FromQuery] Pagination pagination)
    {
        var auditLogs = await _auditLogService.GetByUserIdAsync(pagination.Skip, pagination.Take, userId);

        if (!auditLogs.Any())
            return NoContent();

        return Ok(auditLogs.ToViewModel());
    }

    [HttpGet("action/{actionType}")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(IEnumerable<AuditLogViewModel>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByActionType(AuditActionType actionType, [FromQuery] Pagination pagination)
    {
        var auditLogs = await _auditLogService.GetByActionTypeAsync(pagination.Skip, pagination.Take, actionType);

        if (!auditLogs.Any())
            return NoContent();

        return Ok(auditLogs.ToViewModel());
    }
}
