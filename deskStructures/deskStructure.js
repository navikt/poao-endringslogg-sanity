export const structure = (S) => {
    return (S.list()
            .title('Innhold')
            .items([
                ...S.documentTypeListItems(),
            ])
    )
}
