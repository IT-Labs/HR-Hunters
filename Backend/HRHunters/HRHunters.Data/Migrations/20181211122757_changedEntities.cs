using Microsoft.EntityFrameworkCore.Migrations;

namespace HRHunters.Data.Migrations
{
    public partial class changedEntities : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Applications_JobPostings_JobPostingId",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "Location",
                table: "JobPostings");

            migrationBuilder.DropColumn(
                name: "JobId",
                table: "Applications");

            migrationBuilder.AlterColumn<int>(
                name: "JobPostingId",
                table: "Applications",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Applications_JobPostings_JobPostingId",
                table: "Applications",
                column: "JobPostingId",
                principalTable: "JobPostings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Applications_JobPostings_JobPostingId",
                table: "Applications");

            migrationBuilder.AddColumn<string>(
                name: "Location",
                table: "JobPostings",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<int>(
                name: "JobPostingId",
                table: "Applications",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddColumn<int>(
                name: "JobId",
                table: "Applications",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddForeignKey(
                name: "FK_Applications_JobPostings_JobPostingId",
                table: "Applications",
                column: "JobPostingId",
                principalTable: "JobPostings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
