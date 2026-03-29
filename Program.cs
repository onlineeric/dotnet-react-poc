using System.Text.Json;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowViteDev", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

var clientDistPath = Path.Combine(builder.Environment.ContentRootPath, "client", "dist");
if (!Directory.Exists(clientDistPath))
{
    Directory.CreateDirectory(clientDistPath);
}

var fileProvider = new PhysicalFileProvider(clientDistPath);

app.UseCors("AllowViteDev");

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = fileProvider
});

var productsFilePath = Path.Combine(builder.Environment.ContentRootPath, "data", "products.json");
var jsonOptions = new JsonSerializerOptions
{
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    WriteIndented = true
};

List<Product> LoadProducts()
{
    var json = File.ReadAllText(productsFilePath);
    return JsonSerializer.Deserialize<List<Product>>(json, jsonOptions) ?? [];
}

void SaveProducts(List<Product> products)
{
    File.WriteAllText(productsFilePath, JsonSerializer.Serialize(products, jsonOptions));
}

app.MapGet("/api/status", () => new
{
    status = "Server Started",
    timestamp = DateTime.UtcNow
});

app.MapGet("/api/products", () => LoadProducts());

app.MapGet("/api/product/{id}", (string id) =>
{
    var product = LoadProducts().FirstOrDefault(p => p.Id == id);
    return product is not null ? Results.Ok(product) : Results.NotFound();
});

app.MapPost("/api/product", (Product updated) =>
{
    var products = LoadProducts();
    var index = products.FindIndex(p => p.Id == updated.Id);
    if (index == -1)
    {
        return Results.NotFound();
    }
    products[index] = updated;
    SaveProducts(products);
    return Results.Ok(updated);
});

app.MapFallbackToFile("index.html", new StaticFileOptions
{
    FileProvider = fileProvider
});

app.Run();

public record Product
{
    public string Id { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public DateTime CreateDate { get; init; }
    public int Quantity { get; init; }
    public decimal Price { get; init; }
}
