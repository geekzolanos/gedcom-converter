/* Required : GedcomConst */
var GedcomLang = {

	language : null,

	$ : null,

	defs : {
		'en' : {
			'common' : {
				'yes' : "Yes",
				'no' : "No",
				'when' : "the",
				'where' : "at"
			},
			'index' : {
				'close' : "Close",
				'history' : "History",
				'log' : "Log",
				'quickSelect' : "Choose the person to display"
			},
			'personne' : {
				'privacy' : "Private data",
				'sexe' : {
					'M' : '',
					'F' : ''
				}
			},
			'viewer' : {
				'clicknavigate' : "Click to focus on this person",
				'dbclicknavigate' : "Double-click to focus on this person",
				'clickopen' : "Click to open the person's detail",
				'multipleNameSeparator' : " or "
			},
			'plugins' : {
				'helper' : {
					'source' : {
						'title' : "Title",
						'titleAbbr' : "Short title",
						'author' : "Author",
						'dateAndPlace' : "Date and place of publication",
						'text' : "Text",
						'notes' : "Notes"
					},
					'dateAndPlace' : {
						'address' : "Address",
						'age' : "age",
						'source' : "Source",
						'notes' : "Notes",
						'displayMap' : "[Display on the map]",
						'hideMap' : "[Hide the map]"
					}
				},
				'privacy' : {
					'title' : "Restriction"
				},
				'sexe' : {
					'title' : "Sex",
					'M' : "Man",
					'F' : "Woman",
					'U' : "Unknown"
				},
				'name' : {
					'title' : "Name"
				},
				'prenom' : {
					'title' : "First name"
				},
				'surn_prefix' : {
					'title' : "Last name (prefix)"
				},
				'nomjf' : {
					'title' : "Last name"
				},
				'name_suffix' : {
					'title' : "Last name (suffix)"
				},
				'nom' : {
					'title' : "Common name"
				},
				'nickname' : {
					'title' : "Nickname"
				},
				'birt' : {
					'title' : "Birthday"
				},
				'deat' : {
					'title' : "Death"
				},
				'burri' : {
					'title' : "Burrial"
				},
				'crem' : {
					'title' : "Cremation"
				},
				'prob' : {
					'title' : "Validation of a will"
				},
				'will' : {
					'title' : "Will"
				},
				'familleParent' : {
					'title' : "Parents"
				},
				'adop' : {
					'title' : "Adoption"
				},
				'nmr' : {
					'title' : "Wedding count"
				},
				'familles' : {
					'title' : "Famillies",
					'children' : "Child(ren)",
					'marriage' : "Wedding"
				},
				'familleParentChilds' : {
					'title' : "Brothers and Sisters"
				},
				'nchi' : {
					'title' : "Children count"
				},
				'even' : {
					'title' : "Events"
				},
				'dscr' : {
					'title' : "Description"
				},
				'cens' : {
					'title' : "Census"
				},
				'ssn' : {
					'title' : "Social Security Number"
				},
				'resi' : {
					'title' : "Places of residence"
				},
				'prop' : {
					'title' : "Property and possessions"
				},
				'grad' : {
					'title' : "Graduates"
				},
				'educ' : {
					'title' : "Level of study"
				},
				'occu' : {
					'title' : "Occupations"
				},
				'reti' : {
					'title' : "Retreat"
				},
				'nati' : {
					'title' : "Nationality"
				},
				'emig' : {
					'title' : "Emigration"
				},
				'immi' : {
					'title' : "Immigration"
				},
				'natu' : {
					'title' : "Naturalization"
				},
				'reli' : {
					'title' : "Religion"
				},
				'fcom' : {
					'title' : "First Communion"
				},
				'chr' : {
					'title' : "Christening (child)"
				},
				'chra' : {
					'title' : "Christening (adult)"
				},
				'bapt' : {
					'title' : "Baptism"
				},
				'conf' : {
					'title' : "Confirmation"
				},
				'bless' : {
					'title' : "Religious blessing"
				},
				'ordi' : {
					'title' : "Religious sacrament"
				},
				'ordn' : {
					'title' : "Religious ordination"
				},
				'barm' : {
					'title' : "Bar mitzvah"
				},
				'bars' : {
					'title' : "Bas mitzvah"
				},
				'bapl' : {
					'title' : "Baptism<br/>(Mormon church)"
				},
				'conl' : {
					'title' : "Confirmation<br/>(Mormon church)"
				},
				'endl' : {
					'title' : "Dotation<br/>(Mormon church)"
				},
				'slgc' : {
					'title' : "Sealing of a child to his parents<br/>(Mormon church)"
				},
				'slgs' : {
					'title' : "Sealing of a husband and wife<br/>(Mormon church)"
				},
				'cast' : {
					'title' : "Cast or status"
				},
				'titl' : {
					'title' : "Title of nobility or honor"
				},
				'sources' : {
					'title' : "Sources"
				},
				'notes' : {
					'title' : "Notes"
				},
				'obje' : {
					'title' : "Documents"
				}
			}
		}
	},

	setLanguage : function(language) {
		this.language = language;
		this.$ = this.defs[language];
	}

};

GedcomLang.setLanguage(GedcomConst.LANGUAGE);
