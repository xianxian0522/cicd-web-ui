library 'sslib@master' //引用此工程，格式为<工程名>@<branchName>。此工程会配置在Jenkins中，sslib为Jenkins中配置的工程名，master为branch或tag名。

def jobInfo = [
    nodeName: "centos7_node14_python36", //指定在哪个Jenkins节点上执行
    projName: "devops",//项目名称
    name: "cicd-web-ui",//工程名称
    deployInput:"",//可选，空为分步操作，不空为一键操作，仅限salt
    packageInfo: [
        name: "cicd-web-ui", //可选，默认使用工程名称
        src: "./dist/", //可选，要打包的文件，默认当前文件夹
        archiveFiles: "*.tar.gz", //可选，存档的包文件，可用通配符，默认为*.tar.gz
        appName: "cicd-web-ui", //可选，默认使用应用名称
    ],
    deploysInfo: [
        serverName: "artifactory", //部署目标，必须是在Jenkins中配置好的Artifactory服务器
        packages: [
            [
                fileName: "cicd-web-ui*.tar.gz", //需要部署的文件名，可以使用通配符
                serverName: "artifactory", //发布目标，必须是在Jenkins中配置好的Artifactory服务器
            ]
        ]
    ],
]

building.BuildCplusArtifact(jobInfo) //根据给定的信息执行Pipeline
