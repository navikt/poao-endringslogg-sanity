export const structure = (S) => {
    return (S.list()
            .title('Innhold')
            .items([
                ...S.documentTypeListItems()
                    .filter((listItem) =>
                        !["endringslogg_mr-adminflate"].includes(listItem.getId())
                    ),
                S.divider(),
                ...S.documentTypeListItems()
                    .filter((listItem) =>
                        ["endringslogg_mr-adminflate"].includes(listItem.getId())
                    ),
            ])
    )
}
