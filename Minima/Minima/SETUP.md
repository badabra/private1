# Minima — Guide d'installation (Sprint 1)

Ce guide explique comment faire fonctionner le projet sur votre machine après avoir cloné le dépôt.

## Prérequis

1. **.NET 8 SDK** — https://dotnet.microsoft.com/download/dotnet/8.0
2. **SQL Server Express 2025** (gratuit) — https://www.microsoft.com/en-us/sql-server/sql-server-downloads
   - Cliquez sur "Download now" sous **Express** (pas Developer, pas "2025 on-premises")
   - Lancez l'installeur → choisissez **"Basic"**
   - Notez le nom d'instance affiché à la fin (normalement `SQLEXPRESS`)
3. **Visual Studio 2022** ou VS Code avec l'extension C#

## Étapes d'installation

### 1. Cloner et restaurer les packages

```powershell
git clone https://github.com/badabra/minima.git
cd minima/Minima
dotnet restore
```

### 2. Installer l'outil EF Core (une seule fois par machine)

```powershell
dotnet tool install --global dotnet-ef
```

Si déjà installé, vous verrez une erreur "already installed" — c'est normal, ignorez-la.

### 3. Vérifier la chaîne de connexion

Ouvrez `appsettings.json`. Si votre instance SQL Server Express ne s'appelle pas `SQLEXPRESS`
(visible dans l'installeur sous "Instance Name"), modifiez la ligne :

```json
"DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=Minima;Trusted_Connection=true;TrustServerCertificate=true;"
```

en remplaçant `SQLEXPRESS` par le nom de votre instance.

### 4. Créer la base de données

```powershell
dotnet ef database update
```

Cela crée la base `Minima` avec toutes les tables (Users, Contacts, Messages, PasswordResetTokens)
sur votre instance locale.

> **Important :** après chaque `git pull`, relancez `dotnet ef database update` — si un coéquipier
> a ajouté une migration, cette commande met votre base à jour automatiquement.

### 4b. Configurer l'envoi de courriels (code de vérification)

À l'inscription, un code de vérification à 6 chiffres est envoyé par courriel ; il faut le
saisir pour activer le compte. Renseignez la section `Email` de `appsettings.json` :

```json
"Email": {
  "SmtpHost": "smtp.gmail.com",
  "SmtpPort": "587",
  "SmtpUser": "votre-adresse@gmail.com",
  "SmtpPassword": "mot-de-passe-application",
  "FromEmail": "votre-adresse@gmail.com",
  "FromName": "Minima",
  "EnableSsl": "true"
}
```

- **Gmail** : activez la validation en 2 étapes sur le compte Google, puis créez un
  « mot de passe d'application » (16 caractères) à coller dans `SmtpPassword`.
- **Alternative test (Mailtrap.io)** : compte gratuit, les courriels n'atteignent pas de vrais
  destinataires mais s'affichent dans une boîte de test. Copiez host/port/user/pass fournis.

> Si `SmtpHost` reste **vide**, l'application ne plante pas : le code de vérification est
> écrit dans la **console du serveur** (mode développement) au lieu d'être envoyé.
>
> ⚠️ Ne commitez jamais un vrai mot de passe SMTP. Pour le garder hors de Git, utilisez
> `dotnet user-secrets` plutôt que `appsettings.json`.

### 5. Lancer l'application

```powershell
dotnet run
```

Ouvrez l'URL affichée dans le terminal (ex: `http://localhost:5199/Register`) dans votre navigateur.

## Vérifier dans SSMS (optionnel)

1. Ouvrez SQL Server Management Studio
2. Server name : `localhost\SQLEXPRESS` (ou votre nom d'instance)
3. Authentication : Windows Authentication
4. Connect → `Databases` → `Minima` → `Tables` → `dbo.Users`

## Problèmes fréquents

- **"Could not execute because the specified command or file was not found"** → l'outil `dotnet-ef`
  n'est pas installé (étape 2) ou le terminal n'a pas été redémarré après l'installation.
- **"A network-related or instance-specific error..."** → SQL Server Express n'est pas installé,
  ou le nom d'instance dans `appsettings.json` ne correspond pas au vôtre (étape 3).
- **Erreur de version NuGet (NU1605)** → ne changez pas les versions des packages
  `Microsoft.EntityFrameworkCore.*` sans coordination avec l'équipe ; elles sont pinnées à `8.0.26`
  pour rester compatibles entre elles.
