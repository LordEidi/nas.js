//
// gcc smartctl_a.c -o smartctl_a
//
// chown root:root smartctl_a
// chmod 4755 smartctl_a

#include <stdio.h>
#include <string.h>
#include <unistd.h>

int main(int argc, char *argv[])
{
    if (argc > 1)
    {
        char path[128] = "/usr/sbin/smartctl";

        char * parmList[] = {"/usr/sbin/smartctl", "-a", argv[1], NULL};

        int ret = execvp (path, parmList);
        if (ret == -1) {
            perror("execve error");
        }
    }
    else
    {
        perror("missing argument");
    }

    return 1;
}
