using Microsoft.EntityFrameworkCore.Migrations;

namespace HRHunters.Data.Migrations
{
    public partial class init2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Apllicants_AspNetUsers_UserId",
                table: "Apllicants");

            migrationBuilder.DropForeignKey(
                name: "FK_Applications_Apllicants_ApplicantId",
                table: "Applications");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Apllicants",
                table: "Apllicants");

            migrationBuilder.RenameTable(
                name: "Apllicants",
                newName: "Applicants");

            migrationBuilder.RenameIndex(
                name: "IX_Apllicants_UserId",
                table: "Applicants",
                newName: "IX_Applicants_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Applicants",
                table: "Applicants",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Applicants_AspNetUsers_UserId",
                table: "Applicants",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Applications_Applicants_ApplicantId",
                table: "Applications",
                column: "ApplicantId",
                principalTable: "Applicants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Applicants_AspNetUsers_UserId",
                table: "Applicants");

            migrationBuilder.DropForeignKey(
                name: "FK_Applications_Applicants_ApplicantId",
                table: "Applications");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Applicants",
                table: "Applicants");

            migrationBuilder.RenameTable(
                name: "Applicants",
                newName: "Apllicants");

            migrationBuilder.RenameIndex(
                name: "IX_Applicants_UserId",
                table: "Apllicants",
                newName: "IX_Apllicants_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Apllicants",
                table: "Apllicants",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Apllicants_AspNetUsers_UserId",
                table: "Apllicants",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Applications_Apllicants_ApplicantId",
                table: "Applications",
                column: "ApplicantId",
                principalTable: "Apllicants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
