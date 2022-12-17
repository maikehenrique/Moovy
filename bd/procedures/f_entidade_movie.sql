CREATE OR REPLACE FUNCTION f_entidade_movie(
    PAction VARCHAR(255)
	,PParameter TEXT
	,OUT RStatus BOOLEAN
	,OUT RMensagem TEXT
	,OUT RMensagemContexto TEXT
	,OUT RRetorno JSONB
)
AS
$BODY$
DECLARE
	VRecord			RECORD;
    VJsonGenerico   JSONB;                

BEGIN
    IF (COALESCE(TRIM(PAction), '') NOT IN (
        'search_movies'
		,'search_favorit_movies'
    )) THEN

		RAISE EXCEPTION 'Invalid values ​​for the parameter [PAction = %]', PAction
			USING ERRCODE = 'ERROR';

	ELSEIF (PParameter IS NULL) THEN

		RAISE EXCEPTION 'Invalid value for parameter[PParameter]'
			USING ERRCODE = 'ERROR';

	END IF;
    --RAISE EXCEPTION '123123';
    IF(PAction = 'search_movies') THEN
        
        VJsonGenerico = (SELECT CAST(convert_from(DECODE(CAST(PParameter AS TEXT), 'base64'), 'UTF8') AS JSONB));
        RAISE notice '%',VJsonGenerico;
        WITH sub_dados AS (
            SELECT s.value ->> 'imdbID' "imdbID"
                ,s.value ->> 'Title' "Title"
                ,s.value ->> 'Year' AS "Year"
                ,s.value ->> 'Type' AS "Type"
                ,s.value ->> 'Poster' "Poster"
            FROM JSON_ARRAY_ELEMENTS(CAST(VJsonGenerico ->> 'Search' AS JSON)) s
        )
        ,sub_review AS (
            SELECT r.id_movie 
                ,r.id_user 
                ,CAST(ARRAY_TO_JSON(ARRAY_AGG(ROW_TO_JSON(r)))  AS JSONB) review 
            FROM (
            SELECT r.id_movie 
                ,r.id_user 
                ,CONVERT_FROM(r.review, 'utf-8') review
            FROM review_movie r
            GROUP BY 
                r.id_movie 
                ,r.id_user 
            ,r.review
            )r
            GROUP BY 
                r.id_movie 
                ,r.id_user 
        )
        SELECT CAST('{"Search": ' || CAST(ARRAY_TO_JSON(ARRAY_AGG(ROW_TO_JSON(f)))  AS TEXT) || '}' AS JSONB) 
            || CAST('{"TotalResults": ' || COALESCE(VJsonGenerico ->> 'totalResults', '0' ) || '}' AS JSONB)
            || CAST('{"Response": ' || COALESCE( CAST(VJsonGenerico ->> 'Response' AS BOOLEAN), false ) || '}' AS JSONB)
        FROM (
        SELECT s."imdbID"
            ,s."Title"
            ,s."Year"
            ,s."Type"
            ,s."Poster"
            ,(CASE WHEN EXISTS(SELECT 1 FROM favorit_movie f WHERE f.id_movie  = s."imdbID" AND f.id_user = COALESCE(VJsonGenerico ->> 'idUsuario', '' ))
                THEN TRUE
                ELSE FALSE 
            END) favorit
            ,sr.review
            FROM sub_dados s
                LEFT JOIN sub_review sr ON (sr.id_movie = s."imdbID" AND sr.id_user = COALESCE(VJsonGenerico ->> 'idUsuario', '' ) )
        )f
        INTO RRetorno;
    END IF;

    IF(PAction = 'search_favorit_movies') THEN
        VJsonGenerico = (SELECT CAST(convert_from(DECODE(CAST(PParameter AS TEXT), 'base64'), 'UTF8') AS JSONB));

        WITH sub_review AS (
            SELECT r.id_movie 
                ,r.id_user 
                ,CAST(ARRAY_TO_JSON(ARRAY_AGG(ROW_TO_JSON(r)))  AS JSONB) review 
            FROM (
            SELECT r.id_movie 
                ,r.id_user 
                ,CONVERT_FROM(r.review, 'utf-8') review
            FROM review_movie r
            GROUP BY 
                r.id_movie 
                ,r.id_user 
            ,r.review
            )r
            GROUP BY 
                r.id_movie 
                ,r.id_user 
        )
        SELECT CAST('{"Search": ' || CAST(ARRAY_TO_JSON(ARRAY_AGG(ROW_TO_JSON(f)))  AS TEXT) || '}' AS JSONB) 
        FROM (
        SELECT s.id_movie "imdbID"
            ,TRUE favorit
            ,sr.review
            FROM favorit_movie s
                LEFT JOIN sub_review sr ON (sr.id_movie = s.id_movie AND sr.id_user = COALESCE(VJsonGenerico ->> 'idUser', '' ) )
        )f
        INTO RRetorno;
        
    END IF;

	IF (NOT RRetorno IS NULL) THEN
		RStatus = TRUE;
	END IF;

EXCEPTION
    WHEN OTHERS THEN
        BEGIN
			IF (SQLSTATE = 'ER401') THEN
					RMensagemContexto = '[401]';
			END IF;
			
			IF (SQLSTATE NOT IN('ERROR', 'ER401', 'ERROP')) THEN
				GET STACKED DIAGNOSTICS RMensagemContexto = PG_EXCEPTION_CONTEXT;
			END IF;
			
			IF (SQLSTATE <> 'ERROP') THEN

				RStatus = FALSE;
				RMensagem = SQLERRM;
				RRetorno = NULL;

			END IF;
		
        END;
END;
$BODY$
    LANGUAGE 'plpgsql' VOLATILE;