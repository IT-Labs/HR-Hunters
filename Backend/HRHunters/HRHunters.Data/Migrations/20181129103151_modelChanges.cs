using Microsoft.EntityFrameworkCore.Migrations;

namespace HRHunters.Data.Migrations
{
    public partial class modelChanges : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "JobPostings");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Applications");

            migrationBuilder.AlterColumn<string>(
                name: "Experience",
                table: "Applicants",
                nullable: true,
                oldClrType: typeof(string));

            migrationBuilder.AlterColumn<string>(
                name: "EducationType",
                table: "Applicants",
                nullable: true,
                oldClrType: typeof(string));

            migrationBuilder.AddColumn<string>(
                name: "PhoneNumber",
                table: "Applicants",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                table: "Applicants");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "JobPostings",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Applications",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Experience",
                table: "Applicants",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "EducationType",
                table: "Applicants",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);
        }
    }
}
