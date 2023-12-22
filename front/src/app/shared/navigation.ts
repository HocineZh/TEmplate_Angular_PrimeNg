

export const navigation = [
  {
      label: 'Tableau de Bord',
      icon: 'pi pi-home',
      items: [
          {
              label: 'Tableau de bord',
              icon: 'pi pi-fw pi-home',
              routerLink: ['/dashboard/all']
          }
    ]
  },
  {
    label: 'Programme annuel',
    icon: 'pi pi-align-left',
    routerLink: ['/programme_annuel'],
    privileges: ['evenementPrv.list', 'evenementPrv.listOwn']
  }
  , {
    label: 'Evenements',
    icon: 'pi pi-calendar-plus',
    routerLink: ['/evenements'],
    privileges: ['evenement.list', 'evenement.listOwn']
  }
  ,
  {
    label: 'Suivi des orientation',
    icon: 'pi pi-fw pi-forward',
    routerLink: ['/suiviOrientation'],
    privileges: ['orientation.list']
  },
  {
    label: 'Gestion des PV, comptes rendus et Résolutions',
    icon: 'pi pi-fw pi-copy',
    routerLink: ['/document'],
    privileges: ['document.list']
  },
  {

    label: 'Gestion des Utilisateurs',
    icon: 'pi pi-fw pi-user',
    privileges :['userlog.list','user.list','user.add'],
    items: [
        {
            label: 'Liste des utilisateurs',
            icon: 'pi pi-fw pi-list',
            routerLink: ['/users/list'],
            privileges :['user.list']

        },
        {
            label: 'Créer un nouvel utilisateur',
            icon: 'pi pi-fw pi-user-plus',
            routerLink: ['/users/addUser'],
            privileges :['user.add']
        },
        {
            label: 'Liste des logs des utilisateurs',
            icon: 'pi pi-fw pi-list',
            routerLink: ['/users/listUserLogs'],
            privileges :['userlog.list']

      }
    ]
  },
  {
    label: 'Gestion des roles et privilèges',
    icon: 'pi pi-fw pi-users',
    items: [
        {
            label: 'Liste des rôles',
            icon: 'pi pi-fw pi-list',
            routerLink: ['/roles/list'],
            privileges :['role.list']

        },
        {
            label: 'Créer un role',
            icon: 'pi pi-fw pi-plus',
            routerLink: ['/roles/addRole'],
            privileges :['role.add']
        },
        {
          label: 'Gestion des privilèges',
          icon: 'pi pi-fw pi-cog',
          routerLink: ['/roles/listPrivilege'],
          privileges :['privilege.list']

      }
    ]
  },
  {

    label: 'Gestion des tâches',
    icon: 'pi pi-fw pi-check-square',
    privileges : ['tache.list'],
    items: [
        {
            label: 'Gestion des tâches',
            icon: 'pi pi-fw pi-check-square',
            routerLink: ['/taches/ListAll']
        }
    ]
  },
  {

    label: 'Gestion des organes',
    icon: 'pi pi-th-large',
    privileges :['organe.list'],
    items: [

                {
                  label: 'Liste des organes',
                  icon: 'pi pi-fw pi-list',
                  routerLink: ['/organes/list'],
                  privileges :['organe.list']
                },
                {
                  label: 'Gestion des profils',
                  icon: 'pi pi-fw pi-users',
                  routerLink: ['/permission_membre/list-profil'],
                  privileges :['profil.list']
                }, {
                  label: 'Ajouter un profil',
                  icon: 'pi pi-fw pi-plus',
                  routerLink: ['/permission_membre/add-profil'],
                  privileges :['profil.add']
                },{
                  label: 'Gestion des privilèges',
                  icon: 'pi pi-fw pi-cog',
                  routerLink: ['/permission_membre/list-privilege'],
                  privileges :['profilPriv.list']
                }
            ]

    },
    {
    label: 'Gestion des documents et archives',
    icon: 'pi pi-folder-open',
    routerLink: ['/dossier/list/1']
  },


  {
    label: 'Parametrages',
    icon: 'pi pi-cog',
    items: [
      {
        label: 'Gestion des societes',
        icon: 'pi pi-building',
        routerLink: ['/societes/list'],
        privileges: ['societe.list']
      },
      {
        label: 'Modèles ordre de jour',
        icon: 'pi pi-fw pi-book',
        routerLink: ['/modelOrdreJour'],
        privileges: ['parametrage.all']
      },
      {
        label: 'Modèles point ordre du jour',
        icon: 'pi pi-fw pi-list',
        routerLink: ['/modelPointOrdre'],
        privileges: ['parametrage.all']
      },
      {
        label: 'Modèles process',
        icon: 'pi pi-fw pi-slack',
        routerLink: ['/modelProcess'],
        privileges: ['parametrage.all']
      },
      {
        label: 'Modèles delai',
        icon: 'pi pi-fw pi-hourglass',
        routerLink: ['/modelDelai'],
        privileges: ['parametrage.all']
      },
      {
        label: 'Modèles utilisation ultérieures',
        icon: 'pi pi-fw pi-hourglass',
        routerLink: ['/utilisation'],
        privileges: ['parametrage.all']
      },
      {
        label: 'Type organe',
        icon: 'pi pi-fw pi-list',
        routerLink: ['/typeOrgane'],
        privileges:['typeOrgane.list']
      },
      {
        label: 'Taches',
        icon: 'pi pi-fw pi-tag',
        privileges: ['parametrage.tache.list'],
        routerLink: ['/taches/list']
      },
      {
          label: 'Models taches',
          icon: 'pi pi-fw pi-tags',
          privileges: ['parametrage.tache.list'],
          routerLink: ['/taches/modelTaches']
      }
    ]
  },
  {
      label: 'Reporting',
      icon: 'pi pi-book',
      items: [
        {
          label: 'Reporting of organes',
          icon: 'pi pi-align-left',
          routerLink: ['/reporting']
        }
      ]
  }


];
