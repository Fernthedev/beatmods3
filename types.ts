export interface PackageMetadata {
    version: string,
    qmodUrl: string,
    checksum?: string

    name?: string,
    description?: string,
    source?: string,
    author?: string,
    cover?: string,
    modloader?: string
}

export interface LegacyPackageMetadata extends PackageMetadata {
    /// deprecated, use qmodUrl
    download?: string
}