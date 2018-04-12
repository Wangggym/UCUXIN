const getIcon = (type) => {
    const fileType = [
        {
            suffix: ['webm', 'mp4', 'ogg', 'avi', 'rmvb', 'rm', 'asf', 'mov', 'mpeg', 'mpe', 'wmv', 'mkv'],
            icon: 'video'
        },
        {
            suffix: ['pdf'],
            icon: 'pdf'
        },
        {
            suffix: ['doc', 'docx'],
            icon: 'doc'
        },
        {
            suffix: ['xls', 'xlsx'],
            icon: 'excel'
        },
        {
            suffix: ['ppt', 'pptx'],
            icon: 'ppt'
        },
        {
            suffix: ['jpg', 'jpeg', 'gif', 'bmp', 'png'],
            icon: 'pic'
        },
        {
            suffix: ['mp3', 'ogg', 'wav', 'ape', 'cda', 'au', 'midi', 'mac', 'aac', 'aif'],
            icon: 'music'
        },
        {
            suffix: ['rar', 'zip', '7-zip', 'ace', 'arj', 'bz2', 'cab', 'gzip', 'iso', 'jar', 'lzh', 'tar', 'uue', 'xz', 'z'],
            icon: 'rar'
        },

    ];
    for (let i = 0; i < fileType.length; i++) {
        const suffix = fileType[i].suffix
        const icon = fileType[i].icon
        for (let g = 0; g < suffix.length; g++) {
            if (type === suffix[g]) return icon
        }
    }
    return 'def'
}
export default getIcon
